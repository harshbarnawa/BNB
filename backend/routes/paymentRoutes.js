const express = require("express");
const { createdOrder, verifyPayment } = require("../controllers/paymentController.js");
const router = express.Router();

router.post("/order", createdOrder);
router.post("/verify", verifyPayment);

module.exports = router;