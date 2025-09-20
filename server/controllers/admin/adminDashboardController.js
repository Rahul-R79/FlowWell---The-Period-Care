import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";

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
            { $match: {...filter, paymentStatus: "PAID" } },
            { $group: groupStage },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $project: projectStage },
        ]);

        const topSelling = await Order.aggregate([
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
            topSelling,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
