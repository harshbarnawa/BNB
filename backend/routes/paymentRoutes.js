const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const {
    createdOrder,
    verifyPayment
} = require("../controllers/paymentController.js");

const router = express.Router();

router.post("/order", protect, createdOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
