//adminOrderController
import Order from "../../models/Order.js";
import Wallet from "../../models/Wallet.js";
import WalletTransaction from "../../models/WalletTransaction.js";

/**
 * @function adminGetOrders
 * @description Retrieves a paginated list of orders with optional filters for search, status, and date.
 * @expectedInput req.query: { page?: number, limit?: number, search?: string, filterStatus?: string, date?: string (YYYY-MM-DD) }
 * @expectedOutput {
 *   orders: Array,
 *   totalOrder: Number,
 *   totalPages: Number,
 *   currentPage: Number
 * }
 */
export const adminGetOrders = async (req, res) => {
    let {
        page = 1,
        limit = 10,
        search = "",
        filterStatus = "",
        date = "",
    } = req.query;

    try {
        page = parseInt(page);
        limit = parseInt(limit);

        const query = {};

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { "cartItems.name": { $regex: search, $options: "i" } },
            ];
        }

        if (filterStatus) {
            query.orderStatus = filterStatus;
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const totalOrder = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrder / limit);

        const orders = await Order.find(query)
            .populate("user", "name")
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

/**
 * @function adminGetOrderDetail
 * @description Retrieves detailed information for a specific order.
 * @expectedInput req.params: { orderId: string }
 * @expectedOutput { order: Object } or { message: "order not found" }
 */
export const adminGetOrderDetail = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate("shippingAddress");

        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }

        res.status(200).json({ order });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function adminUpdateOrderStatus
 * @description Updates the status of a specific product within an order and handles related wallet transactions.
 * @expectedInput req.params: { orderId: string }, req.body: { productId: string, newStatus: string ("DELIVERED" | "CANCELLED" | "RETURNED" | "REFUNDED") }
 * @expectedOutput { order: Object } or { message: "order not found" | "product not found" | "Cannot cancel delivered products" }
 */
export const adminUpdateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { productId, newStatus } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "order not found" });

        const product = order.cartItems.id(productId);
        if (!product)
            return res.status(404).json({ message: "product not found" });

        if (product.status === "DELIVERED" && newStatus === "CANCELLED") {
            return res
                .status(400)
                .json({ message: "Cannot cancel delivered products" });
        }

        product.status = newStatus;

        product.statusHistory.push({
            status: newStatus,
            date: new Date(),
            reason: `status changed to ${newStatus}`,
        });

        if (newStatus === "DELIVERED") {
            if (order.paymentMethod === "COD") {
                order.paymentStatus = "PAID";
            }
            order.orderStatus = "DELIVERED";
        }
        if (newStatus === "CANCELLED") {
            order.orderStatus = "CANCELLED";
            if (
                order.paymentMethod !== "COD" &&
                order.paymentMethod !== "SIMPL"
            ) {
                const productSubtotal = product.price * product.quantity;
                const refundableTotal = order.subtotal - order.discount;
                const refundedAmount =
                    (productSubtotal / order.subtotal) * refundableTotal;

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
        }
        if (newStatus === "RETURNED") order.orderStatus = "RETURNED";
        if (newStatus === "REFUNDED") {
            order.orderStatus = "REFUNDED";

            const productSubtotal = product.price * product.quantity;

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
        res.status(200).json({ order });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
