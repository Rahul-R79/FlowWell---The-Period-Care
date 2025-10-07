//adminSalesReport
import Order from "../../models/Order.js";

/**
 * @function getSalesReport
 * @description Retrieves sales report for admin with optional filtering by date range, status, pagination, or all orders.
 * @expectedInput req.query: {
 *   startDate?: string (YYYY-MM-DD),
 *   endDate?: string (YYYY-MM-DD),
 *   status?: string ("PENDING", "COMPLETED", "CANCELLED", etc.),
 *   page?: number (default 1),
 *   limit?: number (default 10),
 *   all?: string ("true" to fetch all orders without pagination)
 * }
 * @expectedOutput res: JSON object containing summary statistics and list of orders, including:
 *   totalOrders, totalRevenue, totalProducts, totalCustomers, cancelOrders, refundedOrders, returnedOrders, orders, totalPages, currentPage
 */
export const getSalesReport = async (req, res) => {
    let { startDate, endDate, status, page = 1, limit = 10, all } = req.query;

    try {
        page = parseInt(page);
        limit = parseInt(limit);
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

        const allOrders = await Order.find(filter);

        const totalOrders = allOrders.length;

        const totalRevenue = allOrders.reduce(
            (sum, order) => sum + order.total,
            0
        );

        const totalProducts = allOrders.reduce(
            (sum, order) =>
                sum +
                order.cartItems.reduce(
                    (itemSum, item) => itemSum + item.quantity,
                    0
                ),
            0
        );

        const totalCustomers = new Set(
            allOrders.map((order) => order.user?._id?.toString())
        ).size;

        const cancelOrders = allOrders.filter((order) =>
            order.cartItems.some((item) => item.status === "CANCELLED")
        ).length;

        const refundedOrders = allOrders.filter((order) =>
            order.cartItems.some((item) => item.status === "REFUNDED")
        ).length;

        const returnedOrders = allOrders.filter((order) =>
            order.cartItems.some((item) => item.status === "RETURNED")
        ).length;

        let orders;
        if (req.query.all === "true") {
            orders = await Order.find(filter).populate("user", "name email");
        } else {
            orders = await Order.find(filter)
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
        }

        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalCustomers,
            cancelOrders,
            refundedOrders,
            returnedOrders,
            orders,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
