const test = require("node:test");
const assert = require("node:assert/strict");
const { categoryIds, parseStoreListing, isHttpsUrl } = require("../utils/storeValidation");

const valid = {
    name: "A sample keyboard",
    brand: "Sample Studio",
    description: "A keyboard catalogue listing for the store.",
    category: "keyboards",
    imageUrl: "",
    priceINR: 2499,
    compareAtINR: 2999,
    mode: "showcase",
    externalUrl: "",
    published: false,
    featured: true,
    sortOrder: 0
};

test("supports eight product categories and safe unpublished defaults", () => {
    assert.equal(categoryIds.length, 8);
    const parsed = parseStoreListing(valid);
    assert.equal(parsed.error, undefined);
    assert.equal(parsed.value.published, false);
    assert.equal(parsed.value.priceINR, 2499);
});

test("rejects invalid price and unapproved external links", () => {
    assert.ok(parseStoreListing({ ...valid, priceINR: -1 }).error);
    assert.ok(parseStoreListing({ ...valid, priceINR: 24.5 }).error);
    assert.ok(parseStoreListing({ ...valid, compareAtINR: 2000 }).error);
    assert.ok(parseStoreListing({ ...valid, externalUrl: "https://store.example/item" }).error);
    assert.ok(parseStoreListing({ ...valid, mode: "affiliate" }).error);
    assert.ok(parseStoreListing({ ...valid, imageUrl: "javascript:alert(1)" }).error);
    assert.ok(parseStoreListing({ ...valid, category: "not-a-category" }).error);
    assert.ok(parseStoreListing({ ...valid, published: "true" }).error);
});

test("accepts valid affiliate links only over HTTPS", () => {
    assert.equal(isHttpsUrl("https://example.com/item?q=1"), true);
    assert.equal(isHttpsUrl("javascript:alert(1)"), false);
    assert.equal(isHttpsUrl("http://example.com"), false);
    const parsed = parseStoreListing({
        ...valid, mode: "affiliate", externalUrl: "https://www.example.com/product", published: true
    });
    assert.equal(parsed.error, undefined);
    assert.equal(parsed.value.mode, "affiliate");
});
