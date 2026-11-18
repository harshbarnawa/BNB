const mongoose = require("mongoose");
const StoreListing = require("../model/StoreListing");
const { parseStoreListing } = require("../utils/storeValidation");

const publicProducts = async (req, res) => {
    try {
        const products = await StoreListing.find({ published: true })
            .sort({ sortOrder: 1, createdAt: -1 }).limit(150).lean();
        res.set("Cache-Control", "no-store");
        return res.json({ products });
    } catch (error) {
        console.error("Store catalogue error:", error.message);
        return res.status(503).json({ message: "Store catalogue is temporarily unavailable." });
    }
};

const adminProducts = async (req, res) => {
    try {
        const products = await StoreListing.find({})
            .sort({ createdAt: -1 }).limit(200).lean();
        res.set("Cache-Control", "no-store");
        return res.json({ products });
    } catch (error) {
        console.error("Store admin listing error:", error.message);
        return res.status(500).json({ message: "Unable to load store products." });
    }
};

const createProduct = async (req, res) => {
    const parsed = parseStoreListing(req.body);
    if (parsed.error) return res.status(400).json({ message: parsed.error });
    try {
        const created = await StoreListing.create(parsed.value);
        return res.status(201).json({ product: created });
    } catch (error) {
        console.error("Store create error:", error.message);
        return res.status(500).json({ message: "Unable to add this product." });
    }
};

const updateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
    const parsed = parseStoreListing(req.body);
    if (parsed.error) return res.status(400).json({ message: parsed.error });
    try {
        const updated = await StoreListing.findByIdAndUpdate(
            req.params.id, { $set: parsed.value }, { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Product not found." });
        return res.json({ product: updated });
    } catch (error) {
        console.error("Store update error:", error.message);
        return res.status(500).json({ message: "Unable to update this product." });
    }
};

const deleteProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
    try {
        const removed = await StoreListing.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ message: "Product not found." });
        return res.json({ message: "Product deleted." });
    } catch (error) {
        console.error("Store delete error:", error.message);
        return res.status(500).json({ message: "Unable to delete this product." });
    }
};

module.exports = { publicProducts, adminProducts, createProduct, updateProduct, deleteProduct };
