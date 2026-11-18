const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { listPublicPackages, listAdminPackages, updatePackagePricing } = require("../controllers/servicePackageController");

const router = express.Router();

router.get("/", listPublicPackages);
router.get("/admin", protect, admin, listAdminPackages);
router.patch("/:serviceId/:tierId", protect, admin, updatePackagePricing);

module.exports = router;
