const test = require("node:test");
const assert = require("node:assert/strict");
const { servicePackages, buildCatalog, validPackage } = require("../utils/servicePackagesCatalog");
const { parseLeadPayload } = require("../utils/leadValidation");

test("every service has three independent scope options", () => {
    assert.equal(Object.keys(servicePackages).length, 6);
    const publicItems = buildCatalog();
    assert.equal(publicItems.length, 18);
    for (const [serviceId] of Object.entries(servicePackages)) {
        const options = publicItems.filter((entry) => entry.serviceId === serviceId);
        assert.deepEqual(options.map((entry) => entry.tierId), ["starter", "growth", "custom"]);
        assert.ok(options.every((entry) => entry.scope.length >= 4));
        assert.ok(options.every((entry) => entry.startingPriceINR === null));
    }
});

test("unpublished prices are never exposed publicly", () => {
    const pricing = [
        { serviceId: "business", tierId: "starter", startingPriceINR: 19999, published: false },
        { serviceId: "business", tierId: "growth", startingPriceINR: 59999, published: true }
    ];
    const list = buildCatalog(pricing);
    const hidden = list.find((entry) => entry.serviceId === "business" && entry.tierId === "starter");
    const visible = list.find((entry) => entry.serviceId === "business" && entry.tierId === "growth");

    assert.equal(hidden.startingPriceINR, null);
    assert.equal(visible.startingPriceINR, 59999);
    assert.equal(Object.prototype.hasOwnProperty.call(hidden, "draftPriceINR"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(hidden, "published"), false);
});

test("admin can inspect draft pricing and custom projects cannot have fixed prices", () => {
    const pricing = [
        { serviceId: "business", tierId: "starter", startingPriceINR: 19999, published: false },
        { serviceId: "business", tierId: "custom", startingPriceINR: 12345, published: true }
    ];
    const list = buildCatalog(pricing, true);
    const draft = list.find((entry) => entry.serviceId === "business" && entry.tierId === "starter");
    const custom = list.find((entry) => entry.serviceId === "business" && entry.tierId === "custom");

    assert.equal(draft.draftPriceINR, 19999);
    assert.equal(draft.published, false);
    assert.equal(custom.startingPriceINR, null);
    assert.equal(custom.editable, false);
});

test("enquiry validates the service and package combination", () => {
    const base = {
        name: "Sample Customer",
        email: "sample@example.com",
        serviceId: "portfolio",
        requirements: "A portfolio showing my recent projects and skills.",
        consent: true
    };
    assert.ok(validPackage("portfolio", "growth"));
    assert.equal(validPackage("not-a-service", "growth"), false);
    assert.equal(validPackage("portfolio", "enterprise"), false);
    assert.equal(parseLeadPayload({ ...base, packageTierId: "growth" }).value.packageTierId, "growth");
    assert.ok(parseLeadPayload({ ...base, packageTierId: "enterprise" }).error);
    assert.ok(parseLeadPayload({ ...base, packageTierId: { $gt: "" } }).error);
    assert.equal(parseLeadPayload(base).value.packageTierId, "");
});
