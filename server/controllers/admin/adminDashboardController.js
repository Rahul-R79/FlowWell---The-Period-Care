//adminDashboardController
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";

/**
 * @function getDashboard
 * @description Fetches all admin dashboard statistics including orders, revenue, products, users, charts, and top-selling items.
 * @expectedInput req.query: { startDate?: string (ISO), endDate?: string (ISO), range?: "monthly" | "yearly" }
 * @expectedOutput {
 *   totalOrders: Number,
 *   activeOrders: Number,
 *   completedOrders: Number,
 *   returnedOrders: Number,
 *   totalRevenue: Number,
 *   refundRevenue: Number,
 *   totalProducts: Number,
 *   totalCustomers: Number,
 *   salesTrend: Array<{ year: Number, month?: Number, totalSales: Number }>,
 *   topSellingProducts: Array<{ _id, name, image, totalQuantity, totalSales }>,
 *   topSellingCategories: Array<{ _id: String, totalSold: Number }>,
 *   totalChartGroup: Array<{ _id: String, count: Number }>
 * }
 */
export const getDashboard = async (req, res) => {
    const { startDate, endDate, range } = req.query;

    try {
        let filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        //order cards data
        const totalOrders = await Order.countDocuments(filter);
        const activeOrders = await Order.countDocuments({
            ...filter,
            orderStatus: { $in: ["PLACED", "SHIPPED", "OUT FOR DELIVERY"] },
        });
        const completedOrders = await Order.countDocuments({
            ...filter,
            orderStatus: "DELIVERED",
        });
        const returnedOrders = await Order.countDocuments({
            ...filter,
            orderStatus: "RETURNED",
        });
        const revenueAgg = await Order.aggregate([
            { $match: { ...filter, paymentStatus: "PAID" } },
            { $group: { _id: null, revenue: { $sum: "$total" } } },
        ]);
        const totalRevenue = revenueAgg[0].revenue;

        const refundAgg = await Order.aggregate([
            { $match: { ...filter, orderStatus: "REFUNDED" } },
            { $group: { _id: null, revenue: { $sum: "$total" } } },
        ]);
        const refundRevenue = refundAgg[0].revenue;

        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments();

        //sales line graph
        let groupStage = {};
        let projectStage = {};

        if (range === "yearly") {
            groupStage = {
                _id: { year: { $year: "$createdAt" } },
                totalSales: { $sum: "$total" },
            };
            projectStage = {
                _id: 0,
                year: "$_id.year",
                totalSales: 1,
            };
        } else {
            groupStage = {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                totalSales: { $sum: "$total" },
            };
            projectStage = {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalSales: 1,
            };
        }

        const salesTrend = await Order.aggregate([
            { $match: { ...filter, paymentStatus: "PAID" } },
            { $group: groupStage },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $project: projectStage },
        ]);

        //pie chart
        let pieChartFilter = {};

        if (range === "monthly") {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59
            );

            pieChartFilter.createdAt = {
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        } else if (range === "yearly") {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

            pieChartFilter.createdAt = {
                $gte: startOfYear,
                $lte: endOfYear,
            };
        }

        const totalChartGroup = await Order.aggregate([
            { $match: pieChartFilter },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        //top selling products
        const topSellingProducts = await Order.aggregate([
            { $match: filter },
            { $unwind: "$cartItems" },
            {
                $group: {
                    _id: "$cartItems.productId",
                    name: { $first: "$cartItems.name" },
                    image: { $first: "$cartItems.image" },
                    totalQuantity: { $sum: "$cartItems.quantity" },
                    totalSales: {
                        $sum: {
                            $multiply: [
                                "$cartItems.price",
                                "$cartItems.quantity",
                            ],
                        },
                    },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
        ]);

        //top selling categories
        const topSellingCategories = await Order.aggregate([
            { $unwind: "$cartItems" },

            {
                $lookup: {
                    from: "products",
                    localField: "cartItems.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },

            { $unwind: "$productDetails" },

            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.category",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },

            { $unwind: "$categoryDetails" },

            {
                $group: {
                    _id: "$categoryDetails.name",
                    totalSold: { $sum: "$cartItems.quantity" },
                },
            },

            { $sort: { totalSold: -1 } },

            { $limit: 10 },
        ]);

        res.status(200).json({
            totalOrders,
            activeOrders,
            completedOrders,
            returnedOrders,
            totalRevenue,
            refundRevenue,
            totalProducts,
            totalCustomers,
            salesTrend,
            topSellingProducts,
            topSellingCategories,
            totalChartGroup,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
