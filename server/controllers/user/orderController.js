import Address from "../../models/Address.js";
import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";

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

export const createOrder = async (req, res) => {
    const { paymentMethod, shippingAddressId } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "products.product"
        );
        if (!cart) {
            return res.status(400).json({ message: "cart is empty" });
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

        const order = await Order.create({
            user: req.user.id,
            cartItems: cart.products.map((item) => ({
                productId: item.product._id,
                name: item.product.name,
                price: item.product.basePrice,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
            })),

            subtotal: totals.subtotal,
            discount: totals.discount,
            deliveryFee: totals.deliveryFee,
            total: totals.total,

            shippingAddress: address._id,

            paymentMethod,

            paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        });

        cart.products = [];
        await cart.save();

        return res
            .status(201)
            .json({ message: "Order placed successfully", order });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
