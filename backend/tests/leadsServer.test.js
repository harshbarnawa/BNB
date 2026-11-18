const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const { app } = require("../leadsServer");

test("enquiries API responds correctly without requiring a database connection", async (t) => {
    const server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    t.after(() => new Promise((resolve) => server.close(resolve)));
    const origin = "http://127.0.0.1:" + server.address().port;

    const health = await fetch(origin + "/health");
    assert.equal(health.status, 503);
    assert.equal((await health.json()).status, "unavailable");

    const unauthorized = await fetch(origin + "/api/leads");
    assert.equal(unauthorized.status, 401);

    const invalid = await fetch(origin + "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "X",
            email: "not an email",
            serviceId: "missing",
            requirements: "short",
            consent: false
        })
    });
    assert.equal(invalid.status, 400);

    const unauthorizedPricing = await fetch(origin + "/api/packages/admin");
    assert.equal(unauthorizedPricing.status, 401);

    const unauthorizedPriceUpdate = await fetch(origin + "/api/packages/business/starter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startingPriceINR: 19999, published: true })
    });
    assert.equal(unauthorizedPriceUpdate.status, 401);

    const payments = await fetch(origin + "/api/payments/order", { method: "POST" });
    assert.equal(payments.status, 404);

    const deniedOrigin = await fetch(origin + "/api/leads", {
        method: "OPTIONS",
        headers: {
            Origin: "https://untrusted.example",
            "Access-Control-Request-Method": "POST"
        }
    });
    assert.equal(deniedOrigin.status, 403);
});
