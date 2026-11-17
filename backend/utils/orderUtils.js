const Product = require("../model/Product");

const normalizeItems = (items) => {
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
        throw new Error("Please provide between 1 and 50 order items");
    }

    const quantities = new Map();

    for (const item of items) {
        const productId = String(item.productId || item._id || "");
        const qty = Number(item.qty);

        if (!/^[a-f\d]{24}$/i.test(productId) || !Number.isInteger(qty) || qty < 1 || qty > 99) {
            throw new Error("Each item must have a valid productId and quantity");
        }

        quantities.set(productId, (quantities.get(productId) || 0) + qty);
    }

    return [...quantities.entries()].map(([productId, qty]) => ({ productId, qty }));
};

const getPricedItems = async (items) => {
    const normalized = normalizeItems(items);
    const products = await Product.find({
        _id: { $in: normalized.map(item => item.productId) }
    });

    const productMap = new Map(products.map(product => [String(product._id), product]));

    const pricedItems = normalized.map(item => {
        const product = productMap.get(item.productId);

        if (!product) {
            throw new Error("One or more products are no longer available");
        }

        if (product.stock < item.qty) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        return {
            productId: product._id,
            name: product.name,
            qty: item.qty,
            price: product.price
        };
    });

    const totalAmount = Number(pricedItems.reduce(
        (total, item) => total + item.price * item.qty,
        0
    ).toFixed(2));

    return { items: pricedItems, totalAmount };
};

const validateAddress = (address) => {
    if (!address || typeof address !== "object") {
        throw new Error("A shipping address is required");
    }

    const normalized = {
        fullName: String(address.fullName || address.fulName || "").trim(),
        street: String(address.street || "").trim(),
        city: String(address.city || "").trim(),
        state: String(address.state || "").trim(),
        postalCode: String(address.postalCode || "").trim(),
        country: String(address.country || "").trim()
    };

    if (Object.values(normalized).some(value => !value) || normalized.postalCode.length > 20) {
        throw new Error("Please provide a complete and valid shipping address");
    }

    return normalized;
};

const reserveStock = async (items) => {
    const reserved = [];

    try {
        for (const item of items) {
            const product = await Product.findOneAndUpdate(
                { _id: item.productId, stock: { $gte: item.qty } },
                { $inc: { stock: -item.qty } },
                { new: true }
            );

            if (!product) {
                throw new Error("Stock changed while placing the order. Please refresh your cart.");
            }

            reserved.push(item);
        }
    } catch (error) {
        await releaseStock(reserved);
        throw error;
    }
};

const releaseStock = async (items) => {
    for (const item of items) {
        await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.qty } }
        );
    }
};

module.exports = {
    getPricedItems,
    validateAddress,
    reserveStock,
    releaseStock
};
