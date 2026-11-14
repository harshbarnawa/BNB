const Order = require('../model/Order.js');
const User = require('../model/User.js');
const Product = require('../model/Product.js');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({role: 'user'});
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({});

const totalRevenueData = orders.reduce(
    (acc, order) => acc + Number(order.totalAmount || 0),
    0
);
    res.json({
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenueData
    });
  }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch admin stats" });
    }
};

module.exports = {
    getAdminStats
};