const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const leadRateLimit = require("../middleware/leadRateLimit");
const { createLead, listLeads, updateLead } = require("../controllers/leadController");

const router = express.Router();

router.post("/", leadRateLimit, createLead);
router.get("/", protect, admin, listLeads);
router.patch("/:id", protect, admin, updateLead);

module.exports = router;
