const PackagePricing = require("../model/ServicePackagePricing");
const { buildCatalog, servicePackages, pricedTierIds } = require("../utils/servicePackagesCatalog");

const listPublicPackages = async (req, res) => {
    try {
        const pricing = await PackagePricing.find({}).lean();
        res.set("Cache-Control", "no-store");
        return res.json({ packages: buildCatalog(pricing) });
    } catch (error) {
        console.error("Public package listing error:", error.message);
        return res.status(503).json({ message: "Packages are temporarily unavailable." });
    }
};

const listAdminPackages = async (req, res) => {
    try {
        const pricing = await PackagePricing.find({}).lean();
        res.set("Cache-Control", "no-store");
        return res.json({ packages: buildCatalog(pricing, true) });
    } catch (error) {
        console.error("Admin package listing error:", error.message);
        return res.status(500).json({ message: "Unable to load package pricing." });
    }
};

const updatePackagePricing = async (req, res) => {
    const { serviceId, tierId } = req.params;
    if (!servicePackages[serviceId] || !pricedTierIds.includes(tierId)) {
        return res.status(400).json({ message: "Unknown package." });
    }

    const { startingPriceINR, published } = req.body || {};
    if (!Number.isSafeInteger(startingPriceINR) || startingPriceINR < 1000 ||
        startingPriceINR > 50000000 || typeof published !== "boolean") {
        return res.status(400).json({
            message: "Enter a valid starting price in INR (1000–50000000) and select whether to publish it."
        });
    }

    try {
        await PackagePricing.findOneAndUpdate(
            { serviceId, tierId },
            { $set: { startingPriceINR, published } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );
        const pricing = await PackagePricing.find({}).lean();
        res.set("Cache-Control", "no-store");
        return res.json({
            message: published ? "Starting price published." : "Package pricing saved as draft.",
            packages: buildCatalog(pricing, true)
        });
    } catch (error) {
        console.error("Update package pricing error:", error.message);
        return res.status(500).json({ message: "Unable to save package pricing." });
    }
};

module.exports = { listPublicPackages, listAdminPackages, updatePackagePricing };
