const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { publicProducts, adminProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/storeController");

const router = express.Router();
router.get("/products", publicProducts);
router.get("/admin/products", protect, admin, adminProducts);
router.post("/admin/products", protect, admin, createProduct);
router.put("/admin/products/:id", protect, admin, updateProduct);
router.delete("/admin/products/:id", protect, admin, deleteProduct);

module.exports = router;
