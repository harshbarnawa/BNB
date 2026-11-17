const Order = require("../model/Order");
const sendEmail = require("../utils/sendEmail");
const {
    getPricedItems,
    validateAddress,
    reserveStock,
    releaseStock
} = require("../utils/orderUtils");

const notifyOrder = async (user, order) => {
    try {
        const message = `Hi ${user.name},

Your BNB order has been placed.

Order ID: ${order._id}
Amount: ₹${order.totalAmount.toFixed(2)}
Payment method: ${order.paymentMethod.toUpperCase()}
Payment status: ${order.paymentStatus}

Thank you for shopping with BNB.`;

        await sendEmail(user.email, "BNB order confirmation", message);
    } catch (error) {
        console.error("Order email failed:", error.message);
    }
};

const createOrder = async (req, res) => {
    let reservedItems = [];

    try {
        const paymentMethod = String(req.body.paymentMethod || "cod").toLowerCase();

        if (paymentMethod !== "cod") {
            return res.status(400).json({ message: "Use the Razorpay order endpoint for online payments" });
        }

        const { items, totalAmount } = await getPricedItems(req.body.items);
        const address = validateAddress(req.body.address);

        if (address.country.toLowerCase() !== "india") {
            return res.status(400).json({ message: "Cash on Delivery is currently available only in India" });
        }

        await reserveStock(items);
        reservedItems = items;

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentMethod: "cod",
            paymentStatus: "pending",
            status: "processing"
        });

        reservedItems = [];
        await notifyOrder(req.user, order);

        return res.status(201).json({
            message: "Cash on Delivery order placed successfully",
            order
        });
    } catch (error) {
        if (reservedItems.length) {
            await releaseStock(reservedItems).catch(rollbackError => {
                console.error("Stock rollback failed:", rollbackError);
            });
        }

        const clientError = /provide|valid|available|stock|quantity|shipping|address|items|products|COD|must be/i.test(error.message);
        return res.status(clientError ? 400 : 500).json({
            message: error.message || "Error creating order"
        });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.productId", "name price imageUrl")
            .sort({ createdAt: -1 });

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching orders" });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.productId", "name price imageUrl")
            .sort({ createdAt: -1 });

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = ["processing", "shipped", "delivered", "cancelled"];
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "cancelled" || order.status === "delivered") {
            return res.status(409).json({ message: "This order can no longer be changed" });
        }

        const shouldRestoreStock = status === "cancelled" &&
            (order.paymentMethod === "cod" || order.paymentStatus === "paid");

        if (status === "cancelled" && order.paymentStatus === "paid") {
            order.paymentStatus = "refund_required";
        }

        if (status === "delivered" && order.paymentMethod === "cod") {
            order.paymentStatus = "paid";
        }

        order.status = status;
        await order.save();

        if (shouldRestoreStock) {
            try {
                await releaseStock(order.items);
            } catch (stockError) {
                console.error("Order cancelled but stock restoration needs manual attention:", stockError);
            }
        }

        return res.json({
            message: "Order status updated successfully",
            stockRestorationWarning: shouldRestoreStock ? "Check inventory if stock restoration did not complete." : null,
            order
        });
    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({ message: "Error updating order status" });
    }
};

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };
