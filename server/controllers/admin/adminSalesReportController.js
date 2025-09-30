import Order from "../../models/Order.js";

//get admin sales report
export const getSalesReport = async (req, res) => {
    let { startDate, endDate, status } = req.query;

    try {
        let filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        if (status) {
            filter.cartItems = { $elemMatch: { status } };
        }

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        const totalOrders = orders.length;

        const totalRevenue = orders.reduce(
            (sum, order) => sum + order.total,
            0
        );

        const totalProducts = orders.reduce(
            (sum, order) =>
                sum +
                order.cartItems.reduce(
                    (itemSum, item) => itemSum + item.quantity,
                    0
                ),
            0
        );

        const totalCustomers = new Set(
            orders.map((order) => order.user?._id?.toString())
        ).size;

        const cancelOrders = orders.filter((order) =>
            order.cartItems.some((item) => item.status === "CANCELLED")
        ).length;

        const refundedOrders = orders.filter((order) =>
            order.cartItems.some((item) => item.status === "REFUNDED")
        ).length;

        const returnedOrders = orders.filter((order) =>
            order.cartItems.some((item) => item.status === "RETURNED")
        ).length;

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalCustomers,
            cancelOrders,
            refundedOrders,
            returnedOrders,
            orders,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
