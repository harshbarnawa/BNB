const mongoose = require("mongoose");

const categories = [
    "components", "keyboards", "mice", "monitors",
    "audio", "laptops", "accessories", "custom-pcs"
];

const storeListingSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    brand: { type: String, trim: true, maxlength: 60, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 1500 },
    category: { type: String, required: true, enum: categories },
    imageUrl: { type: String, default: "", maxlength: 800 },
    priceINR: { type: Number, default: null, min: 0, max: 10000000 },
    compareAtINR: { type: Number, default: null, min: 0, max: 10000000 },
    mode: { type: String, enum: ["showcase", "affiliate"], default: "showcase" },
    externalUrl: { type: String, default: "", maxlength: 1200 },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0, min: 0, max: 9999 }
}, { timestamps: true });

storeListingSchema.index({ published: 1, sortOrder: 1, createdAt: -1 });
storeListingSchema.index({ category: 1, published: 1 });

module.exports = mongoose.model("StoreListing", storeListingSchema);
