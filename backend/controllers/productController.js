const fs = require("fs");
const Product = require("../model/Product.js");
const cloudinary = require("../config/cloudinary.js");

const uploadImage = async (file) => {
    if (!file) return null;

    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "bnb/products",
            resource_type: "image"
        });
        return result.secure_url;
    } finally {
        await fs.promises.unlink(file.path).catch(() => {});
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch products" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json(product);
    } catch (error) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl: suppliedImageUrl } = req.body;

        if (!name?.trim() || !description?.trim() || !category?.trim()) {
            return res.status(400).json({ message: "Name, description and category are required" });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (!Number.isFinite(numericPrice) || numericPrice < 0 ||
            !Number.isInteger(numericStock) || numericStock < 0) {
            return res.status(400).json({ message: "Price must be non-negative and stock must be a non-negative integer" });
        }

        const uploadedImage = await uploadImage(req.file);
        const finalImageUrl = uploadedImage || String(suppliedImageUrl || "").trim();

        if (!finalImageUrl) {
            return res.status(400).json({ message: "A product image is required" });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            stock: numericStock,
            imageUrl: finalImageUrl
        });

        return res.status(201).json(product);
    } catch (error) {
        if (req.file?.path) {
            await fs.promises.unlink(req.file.path).catch(() => {});
        }
        console.error("Create product error:", error);
        return res.status(400).json({ message: error.message || "Unable to create product" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const { name, description, price, category, stock, imageUrl } = req.body;

        if (name !== undefined) product.name = String(name).trim();
        if (description !== undefined) product.description = String(description).trim();
        if (category !== undefined) product.category = String(category).trim();

        if (price !== undefined) {
            const value = Number(price);
            if (!Number.isFinite(value) || value < 0) {
                return res.status(400).json({ message: "Price must be a non-negative number" });
            }
            product.price = value;
        }

        if (stock !== undefined) {
            const value = Number(stock);
            if (!Number.isInteger(value) || value < 0) {
                return res.status(400).json({ message: "Stock must be a non-negative integer" });
            }
            product.stock = value;
        }

        if (imageUrl !== undefined) product.imageUrl = String(imageUrl).trim();

        if (req.file) {
            product.imageUrl = await uploadImage(req.file);
        }

        const updatedProduct = await product.save();
        return res.json(updatedProduct);
    } catch (error) {
        if (req.file?.path) {
            await fs.promises.unlink(req.file.path).catch(() => {});
        }
        console.error("Update product error:", error);
        return res.status(400).json({ message: error.message || "Unable to update product" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();
        return res.json({ message: "Product removed successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Unable to delete product" });
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
