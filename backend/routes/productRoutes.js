const express = require("express");
const multer = require("multer");
const os = require("os");
const path = require("path");
const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController.js");

const router = express.Router();

const upload = multer({
    dest: path.join(os.tmpdir(), "bnb-product-uploads"),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.mimetype)) {
            return callback(new Error("Only JPEG, PNG, WEBP and AVIF images are allowed"));
        }
        return callback(null, true);
    }
});

router.route("/")
    .get(getProducts)
    .post(protect, admin, upload.single("image"), createProduct);

router.route("/:id")
    .get(getProductById)
    .put(protect, admin, upload.single("image"), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
