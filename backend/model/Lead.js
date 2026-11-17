const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    company: { type: String, trim: true, maxlength: 100, default: "" },
    serviceId: {
        type: String,
        required: true,
        enum: ["business", "commerce", "portfolio", "saas", "landing", "custom"]
    },
    budget: { type: String, trim: true, maxlength: 80, default: "" },
    requirements: { type: String, required: true, trim: true, maxlength: 3000 },
    consentAt: { type: Date, required: true },
    status: {
        type: String,
        enum: ["new", "contacted", "discussion", "quotation_sent", "won", "lost"],
        default: "new",
        index: true
    },
    notes: { type: String, default: "", maxlength: 3000 }
}, { timestamps: true });

leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);
