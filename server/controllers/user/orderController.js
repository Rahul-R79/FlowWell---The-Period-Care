import Address from "../../models/Address.js";
import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import { razorpayInstance } from "../../config/razorpay.js";
import Coupon from "../../models/Coupon.js";
import Wallet from "../../models/Wallet.js";
import WalletTransaction from "../../models/WalletTransaction.js";
import mongoose from "mongoose";

// calculate the totals 
const calculateTotals = (cart) => {
    let subtotal = 0;
    let discount = 0;

    cart.products.forEach(({ product, quantity }) => {
        const price = product.basePrice || 0;
        const itemDiscount =
            product.offer === "FLAT" ? price / 2 : product.discountPrice || 0;
        subtotal += price * quantity;
        discount += itemDiscount * quantity;
    });

    const deliveryFee = subtotal > 0 && subtotal < 500 ? 99 : 0;
    const total = subtotal + deliveryFee - discount;

    return { subtotal, discount, deliveryFee, total };
};

//create a cod order
export const createOrder = async (req, res) => {
    const { paymentMethod, shippingAddressId, appliedCouponId } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "products.product"
        );
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const address = await Address.findOne({
            _id: shippingAddressId,
            user: req.user.id,
        });

        if (!address) {
            return res
                .status(400)
                .json({ message: "Invalid shipping address" });
        }

        const totals = calculateTotals(cart);
        const orderNumber = `ORD-${crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase()}`;
        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 5);

        let appliedCoupon = null;
        let couponDiscountAmount = 0;

        if (appliedCouponId) {
            appliedCoupon = await Coupon.findById(appliedCouponId);
            if (!appliedCoupon) {
                return res.status(400).json({ message: "Invalid coupon code" });
            }

            if (appliedCoupon.couponType === "percentage") {
                couponDiscountAmount =
                    (totals.subtotal * appliedCoupon.discountValue) / 100;
                if (appliedCoupon.maxDiscountAmount) {
                    couponDiscountAmount = Math.min(
                        couponDiscountAmount,
                        appliedCoupon.maxDiscountAmount
                    );
                }
            } else if (appliedCoupon.couponType === "fixed") {
                couponDiscountAmount = appliedCoupon.discountValue;
            }
        }

        const finalTotal =
            totals.subtotal -
            totals.discount -
            couponDiscountAmount +
            totals.deliveryFee;

        const cartItems = cart.products.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.basePrice,
            image: item.product.images[0],
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            status: "PLACED",
            statusHistory: [
                {
                    status: "PLACED",
                    date: new Date(),
                },
            ],
        }));

        const order = await Order.create({
            user: req.user.id,
            orderNumber,
            cartItems,
            subtotal: totals.subtotal,
            discount: totals.discount,
            deliveryFee: totals.deliveryFee,
            total: finalTotal,
            shippingAddress: address._id,
            couponDiscount: couponDiscountAmount,
            paymentMethod,
            paymentStatus: "PENDING",
            orderStatus: "PLACED",
            expectedDelivery,
            appliedCoupon: appliedCouponId || null,
        });

        if (appliedCouponId) {
            await Coupon.findByIdAndUpdate(appliedCouponId, {
                $inc: { usageLimit: -1 },
            });
        }

        for (const item of cart.products) {
            await Product.updateOne(
                { _id: item.product._id, "sizes.size": item.selectedSize },
                { $inc: { "sizes.$[elem].stock": -item.quantity } },
                { arrayFilters: [{ "elem.size": item.selectedSize }] }
            );
        }

        cart.products = [];
        await cart.save();

        return res
            .status(201)
            .json({ message: "Order placed successfully", order });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get the placed orders
export const getOrders = async (req, res) => {
    try {
        let { page = 1, limit = 3 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const totalOrder = await Order.countDocuments({ user: req.user.id });
        const totalPages = Math.ceil(totalOrder / limit);

        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            orders,
            totalOrder,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get the order details
export const getOrderItem = async (req, res) => {
    const { orderId, productId } = req.params;

    try {
        const order = await Order.findOne(
            { _id: orderId, "cartItems.productId": productId },
            { cartItems: { $elemMatch: { productId: productId } } }
        );

        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }

        res.status(200).json(order.cartItems[0]);
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//cancel a order
export const cancelOrder = async (req, res) => {
    const { orderId, productId } = req.params;
    const { reason } = req.body;

    try {
        const order = await Order.findOne({
            _id: orderId,
            "cartItems.productId": productId,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const productItem = order.cartItems.find(
            (cart) => cart.productId.toString() === productId
        );

        if (!productItem) {
            return res
                .status(404)
                .json({ message: "Product not found in order" });
        }

        await Product.updateOne(
            {
                _id: productItem.productId,
                "sizes.size": productItem.selectedSize,
            },
            { $inc: { "sizes.$[elem].stock": productItem.quantity } },
            { arrayFilters: [{ "elem.size": productItem.selectedSize }] }
        );

        productItem.status = "CANCELLED";
        productItem.cancelReason = reason;
        productItem.cancelledAt = new Date();
        productItem.statusHistory.push({
            status: "CANCELLED",
            date: new Date(),
            reason: reason,
        });

        const allCancelled = order.cartItems.every(
            (cart) => cart.status === "CANCELLED"
        );
        if (allCancelled) {
            order.orderStatus = "CANCELLED";
        }

        if (order.paymentMethod !== "COD" && order.paymentMethod !== "SIMPL") {
            const productSubtotal = productItem.price * productItem.quantity;

            const totalDiscount =
                (order.discount || 0) + (order.couponDiscount || 0);

            const productDiscount =
                (productSubtotal / order.subtotal) * totalDiscount;

            const refundedAmount =
                Math.round((productSubtotal - productDiscount) * 100) / 100;

            let wallet = await Wallet.findOne({ userId: order.user });
            if (!wallet) {
                wallet = await Wallet.create({
                    userId: order.user,
                    balance: 0,
                });
            }

            wallet.balance += refundedAmount;
            await wallet.save();

            await WalletTransaction.create({
                walletId: wallet._id,
                type: "credit",
                amount: refundedAmount,
                paymentMethod: "wallet",
                transactionFor: "Refund Completed",
            });
        }

        await order.save();

        return res
            .status(200)
            .json({ message: "Product cancelled successfully", order });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//return a order
export const ReturnOrder = async (req, res) => {
    const { orderId, productId } = req.params;
    const { reason } = req.body;

    try {
        const order = await Order.findOne({
            _id: orderId,
            "cartItems.productId": productId,
            user: req.user.id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const productItem = order.cartItems.find(
            (cart) => cart.productId.toString() === productId
        );
        if (!productItem) {
            return res
                .status(404)
                .json({ message: "Product not found in order" });
        }

        productItem.status = "RETURNED";
        productItem.returnReason = reason;
        productItem.returnedAt = new Date();

        productItem.statusHistory.push({
            status: "RETURNED",
            date: new Date(),
            reason: reason,
        });

        const allReturned = order.cartItems.every(
            (cart) => cart.status === "RETURNED"
        );
        if (allReturned) {
            order.orderStatus = "RETURNED";
        }

        await order.save();

        return res
            .status(200)
            .json({ message: "Product returned successfully", order });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

//create the order invoice
export const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate("user")
            .populate("shippingAddress");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");

        if (req.query.download === "true") {
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=invoice-${order.orderNumber}.pdf`
            );
        } else {
            res.setHeader(
                "Content-Disposition",
                `inline; filename=invoice-${order.orderNumber}.pdf`
            );
        }

        doc.pipe(res);

        doc.fontSize(20).text("Purchase Invoice", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Order Number: ${order.orderNumber}`);
        doc.text(`Order Date: ${new Date(order.createdAt).toDateString()}`);
        doc.text(`Customer: ${order.user?.name}`);
        doc.moveDown();

        doc.text("Shipping Address:");
        const addr = order.shippingAddress;
        doc.text(
            `${addr.fullName}, ${addr.streetAddress}, ${addr.locality}, ${addr.city}, ${addr.state}, ${addr.pincode}`
        );
        doc.moveDown();

        order.cartItems.forEach((item, i) => {
            doc.text(
                `${i + 1}. ${item.name} (Size: ${item.selectedSize}) x ${
                    item.quantity
                } - ${item.price}`
            );
        });

        doc.moveDown();
        doc.text(`Subtotal: ${order.subtotal}`);
        doc.text(`Discount: ${order.discount + order.couponDiscount || 0}`);
        doc.text(`Delivery Fee: ${order.deliveryFee}`);
        doc.text(`Total: ${order.total}`, { align: "right", underline: true });

        doc.end();
    } catch (err) {
        res.status(500).json({ message: "error on generating invoice" });
    }
};

//create a razorpay order
export const createRazorpayOrder = async (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_API_KEY,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

//verify the razorpay order
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = req.body;

        const hmac = crypto.createHmac(
            "sha256",
            process.env.RAZORPAY_API_SECRET
        );
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        const orderNumber = `ORD-${crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase()}`;
        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 5);

        const appliedCoupon = orderData?.appliedCouponId
            ? await Coupon.findById(orderData?.appliedCouponId)
            : null;
        let couponDiscountAmount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.couponType === "percentage") {
                couponDiscountAmount =
                    (orderData.subtotal * appliedCoupon.discountValue) / 100;
                if (appliedCoupon.maxDiscountAmount) {
                    couponDiscountAmount = Math.min(
                        couponDiscountAmount,
                        appliedCoupon.maxDiscountAmount
                    );
                }
            } else if (appliedCoupon.couponType === "fixed") {
                couponDiscountAmount = appliedCoupon.discountValue;
            }
        }
        const finalTotal =
            orderData.subtotal -
            (orderData.discount || 0) -
            couponDiscountAmount +
            (orderData.deliveryFee || 0);

        const cartItems = orderData.cart.products.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.basePrice,
            image: item.product.images[0],
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            status: "PLACED",
            statusHistory: [{ status: "PLACED", date: new Date() }],
        }));

        const order = await Order.create({
            user: req.user.id,
            orderNumber,
            cartItems,
            subtotal: orderData.subtotal,
            discount: orderData.discount,
            deliveryFee: orderData.deliveryFee,
            total: finalTotal,
            couponDiscount: couponDiscountAmount,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: "RAZORPAY",
            paymentStatus: "PAID",
            orderStatus: "PLACED",
            expectedDelivery,
            appliedCoupon: orderData?.appliedCouponId || null,
        });

        if (orderData.appliedCouponId) {
            await Coupon.findByIdAndUpdate(orderData.appliedCouponId, {
                $inc: { usageLimit: -1 },
            });
        }

        for (let item of cartItems) {
            await Product.updateOne(
                { _id: item.productId, "sizes.size": item.selectedSize },
                { $inc: { "sizes.$[elem].stock": -item.quantity } },
                { arrayFilters: [{ "elem.size": item.selectedSize }] }
            );
        }

        await Cart.findOneAndUpdate({ user: req.user.id }, { products: [] });

        res.status(200).json({ order });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

//create a wallet order
export const processWalletPayment = async (req, res) => {
    const { walletAmount, shippingAddressId, orderData } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const parsedAmount = Number(walletAmount);
        const wallet = await Wallet.findOne({ userId: req.user.id }).session(
            session
        );

        if (!wallet || wallet.balance < parsedAmount) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(400)
                .json({ message: "Insufficient wallet balance" });
        }

        wallet.balance -= parsedAmount;
        await wallet.save({ session });

        await WalletTransaction.create(
            [
                {
                    walletId: wallet._id,
                    type: "debit",
                    amount: parsedAmount,
                    paymentMethod: "wallet",
                    transactionFor: "Product Purchased",
                },
            ],
            { session }
        );

        const address = await Address.findOne({
            _id: shippingAddressId,
            user: req.user.id,
        });

        if (!address) {
            return res
                .status(400)
                .json({ message: "Invalid shipping address" });
        }

        const orderNumber = `ORD-${crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase()}`;
        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 5);

        const cartItems = orderData.cart.products.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.basePrice,
            image: item.product.images[0],
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            status: "PLACED",
            statusHistory: [{ status: "PLACED", date: new Date() }],
        }));

        const order = await Order.create(
            [
                {
                    user: req.user.id,
                    orderNumber,
                    cartItems,
                    subtotal: orderData.subtotal,
                    discount: orderData.discount,
                    deliveryFee: orderData.deliveryFee,
                    total: orderData.total,
                    shippingAddress: address._id,
                    paymentMethod: "WALLET",
                    paymentStatus: "PAID",
                    orderStatus: "PLACED",
                    expectedDelivery,
                    appliedCoupon: orderData?.appliedCouponId || null,
                },
            ],
            { session }
        );

        if (orderData.appliedCouponId) {
            await Coupon.findByIdAndUpdate(orderData.appliedCouponId, {
                $inc: { usageLimit: -1 },
            });
        }
        for (let item of cartItems) {
            await Product.updateOne(
                { _id: item.productId, "sizes.size": item.selectedSize },
                { $inc: { "sizes.$[elem].stock": -item.quantity } },
                { arrayFilters: [{ "elem.size": item.selectedSize }], session }
            );
        }

        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { products: [] },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ order: order[0] });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error" });
    }
};
