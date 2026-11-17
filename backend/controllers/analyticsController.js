const Order = require("../model/Order.js");
const User = require("../model/User.js");
const Product = require("../model/Product.js");

const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalProducts, revenueResult, pendingOrders] = await Promise.all([
            User.countDocuments({ role: "user" }),
            Order.countDocuments({}),
            Product.countDocuments({}),
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),
            Order.countDocuments({ paymentStatus: "pending" })
        ]);

        return res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            pendingOrders,
            totalRevenue: revenueResult[0]?.total || 0
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch admin stats" });
    }
};

module.exports = { getAdminStats };
