import Order from "../../models/Order.js";

export const adminGetOrders = async (req, res) => {
    let { page = 1, limit = 10, search = "", filterStatus = "", date = "" } = req.query;

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

        if (newStatus === "DELIVERED") order.orderStatus = "DELIVERED";
        if (newStatus === "CANCELLED") order.orderStatus = "CANCELLED";
        if (newStatus === "RETURNED") order.orderStatus = "RETURNED";
        if (newStatus === "REFUNDED") order.orderStatus = "REFUNDED";

        await order.save();
        res.status(200).json({ order });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

