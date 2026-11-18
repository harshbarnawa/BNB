const categoryIds = Object.freeze([
    "components", "keyboards", "mice", "monitors",
    "audio", "laptops", "accessories", "custom-pcs"
]);

function cleanString(value, max) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length <= max ? trimmed : null;
}

function isHttpsUrl(value) {
    if (!value || typeof value !== "string") return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === "https:" && !!parsed.hostname &&
            !parsed.username && !parsed.password;
    } catch {
        return false;
    }
}

function isOptionalPrice(value) {
    return value === null || value === "" || value === undefined ||
        (Number.isSafeInteger(value) && value >= 0 && value <= 10000000);
}

function parseStoreListing(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "Enter valid product details." };
    }

    const name = cleanString(body.name, 120);
    const brand = cleanString(body.brand ?? "", 60);
    const description = cleanString(body.description, 1500);
    const category = cleanString(body.category, 40);
    const imageUrl = cleanString(body.imageUrl ?? "", 800);
    const externalUrl = cleanString(body.externalUrl ?? "", 1200);
    const mode = cleanString(body.mode, 20);
    const sortOrder = body.sortOrder ?? 0;
    const priceINR = body.priceINR === "" || body.priceINR === undefined ? null : body.priceINR;
    const compareAtINR = body.compareAtINR === "" || body.compareAtINR === undefined ? null : body.compareAtINR;

    if (!name || name.length < 3 || description === null || description.length < 10 ||
        brand === null || !categoryIds.includes(category) || imageUrl === null ||
        externalUrl === null || !["showcase", "affiliate"].includes(mode) ||
        typeof body.published !== "boolean" || typeof body.featured !== "boolean" ||
        !Number.isSafeInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999 ||
        !isOptionalPrice(priceINR) || !isOptionalPrice(compareAtINR)) {
        return { error: "Please check the product title, description, category, prices, and listing settings." };
    }

    if (imageUrl && !isHttpsUrl(imageUrl)) {
        return { error: "Product image must be a valid HTTPS URL." };
    }
    if (mode === "affiliate" && (!externalUrl || !isHttpsUrl(externalUrl))) {
        return { error: "Affiliate listings require a valid HTTPS retailer link." };
    }
    if (mode === "showcase" && externalUrl) {
        return { error: "Only affiliate listings can have a retailer link." };
    }
    if (compareAtINR != null && (priceINR == null || compareAtINR <= priceINR)) {
        return { error: "Compare-at price must be greater than the listed price." };
    }

    return {
        value: {
            name, brand, description, category, imageUrl, mode,
            priceINR, compareAtINR,
            externalUrl: mode === "affiliate" ? externalUrl : "",
            published: body.published, featured: body.featured, sortOrder
        }
    };
}

module.exports = { categoryIds, parseStoreListing, isHttpsUrl };
