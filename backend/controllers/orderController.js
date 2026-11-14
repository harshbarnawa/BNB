const Order = require("../model/Order");

const sendEmail = require("../utils/sendEmail");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Invalid order data" });
    }
        else {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentId,
      });

        await order.save();
      const message = `Dear ${req.user.name},\n\nYour order has been successfully placed. Here are the details:\n\nOrder ID: ${order._id}\nTotal Amount: $${totalAmount}\nShipping Address: ${address}\n\nThank you for shopping with us!\n\nBest regards,\nThe BNB Team`;


        await sendEmail(req.user.email,"Order Confirmation", message);

        res.status(201).json({ message: "Order created successfully", order });
    }
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.productId", "name price");
    res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      res.json({ message: "Order status updated successfully", order });
    }
    else {
      res.status(404).json({ message: "Order not found" });
    }
    } catch (error) {
      res.status(500).json({ message: "Error updating order status", error });
    }
};

module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
};