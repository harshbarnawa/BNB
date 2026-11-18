const mongoose = require("mongoose");

const packagePricingSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        required: true,
        enum: ["business", "commerce", "portfolio", "saas", "landing", "custom"]
    },
    tierId: {
        type: String,
        required: true,
        enum: ["starter", "growth"]
    },
    startingPriceINR: {
        type: Number,
        required: true,
        min: 1000,
        max: 50000000,
        validate: Number.isSafeInteger
    },
    published: { type: Boolean, default: false }
}, { timestamps: true });

packagePricingSchema.index({ serviceId: 1, tierId: 1 }, { unique: true });

module.exports = mongoose.model("ServicePackagePricing", packagePricingSchema);
