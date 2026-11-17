const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/Order");
const sendEmail = require("../utils/sendEmail");
const {
    getPricedItems,
    validateAddress,
    reserveStock
} = require("../utils/orderUtils");

const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Online payments are not configured");
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

const createdOrder = async (req, res) => {
    try {
        const address = validateAddress(req.body.address);
        const priced = await getPricedItems(req.body.items);
        const razorpay = getRazorpay();

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(priced.totalAmount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
            notes: { userId: String(req.user._id) }
        });

        const order = await Order.create({
            user: req.user._id,
            items: priced.items,
            totalAmount: priced.totalAmount,
            address,
            paymentMethod: "razorpay",
            paymentStatus: "pending",
            razorpayOrderId: razorpayOrder.id,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            order: razorpayOrder,
            orderId: order._id,
            amount: priced.totalAmount
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        const clientError = /provide|valid|available|stock|quantity|shipping|address|items|products/i.test(error.message);
        return res.status(clientError ? 400 : 500).json({
            success: false,
            message: error.message || "Failed to create payment order"
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature
        } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({ success: false, message: "Payment details are incomplete" });
        }

        const order = await Order.findOne({
            razorpayOrderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Payment order not found" });
        }

        if (order.paymentStatus === "paid") {
            return res.status(200).json({ success: true, message: "Payment was already verified", order });
        }

        if (order.paymentStatus !== "pending") {
            return res.status(409).json({ success: false, message: "This payment order is already being processed or requires support" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest();

        const receivedSignature = Buffer.from(razorpaySignature, "hex");

        if (receivedSignature.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, receivedSignature)) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const razorpay = getRazorpay();
        const payment = await razorpay.payments.fetch(razorpayPaymentId);

        if (payment.order_id !== razorpayOrderId || payment.status !== "captured") {
            return res.status(400).json({ success: false, message: "Payment has not been captured" });
        }

        if (Number(payment.amount) !== Math.round(order.totalAmount * 100)) {
            return res.status(400).json({ success: false, message: "Captured payment amount does not match the order" });
        }

        const claimedOrder = await Order.findOneAndUpdate(
            { _id: order._id, paymentStatus: "pending" },
            { $set: { paymentStatus: "verifying" } },
            { new: true }
        );

        if (!claimedOrder) {
            const latestOrder = await Order.findById(order._id);
            if (latestOrder?.paymentStatus === "paid") {
                return res.status(200).json({ success: true, message: "Payment was already verified", order: latestOrder });
            }
            return res.status(409).json({ success: false, message: "Payment verification is already in progress" });
        }

        try {
            await reserveStock(claimedOrder.items);
        } catch (stockError) {
            claimedOrder.paymentId = razorpayPaymentId;
            claimedOrder.paymentStatus = "refund_required";
            await claimedOrder.save();

            return res.status(409).json({
                success: false,
                message: "Payment received but stock is no longer available. BNB support must arrange a refund.",
                orderId: claimedOrder._id
            });
        }

        claimedOrder.paymentId = razorpayPaymentId;
        claimedOrder.paymentStatus = "paid";
        claimedOrder.status = "processing";
        await claimedOrder.save();

        try {
            await sendEmail(
                req.user.email,
                "BNB payment confirmed",
                `Your payment of ₹${claimedOrder.totalAmount.toFixed(2)} was received. Order ID: ${claimedOrder._id}`
            );
        } catch (emailError) {
            console.error("Payment confirmation email failed:", emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified and order confirmed",
            order: claimedOrder
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};

module.exports = { createdOrder, verifyPayment };
