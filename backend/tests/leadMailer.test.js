const test = require("node:test");
const assert = require("node:assert/strict");
const { buildNotification, isConfigured, sendResendEmail } = require("../utils/leadMailer");

const lead = {
    _id: "507f1f77bcf86cd799439011",
    name: "Test <Customer>",
    email: "customer@example.com",
    phone: "+91 9876543210",
    company: "Sample & Co",
    serviceId: "business",
    budget: "To discuss",
    requirements: "We need a <responsive> website & an admin panel."
};

test("customer thank-you includes reference and escapes HTML", () => {
    const message = buildNotification(lead, "customer");
    assert.deepEqual(message.to, ["customer@example.com"]);
    assert.match(message.text, /507f1f77bcf86cd799439011/);
    assert.match(message.text, /Thank you for reaching out/);
    assert.ok(message.html.includes("Test &lt;Customer&gt;"));
    assert.ok(!message.html.includes("<Customer>"));
    assert.ok(!message.text.includes("admin/leads"));
});

test("owner email includes project details and admin link", () => {
    const previous = process.env.LEAD_NOTIFICATION_EMAIL;
    process.env.LEAD_NOTIFICATION_EMAIL = "owner@example.com";
    try {
        const message = buildNotification(lead, "owner");
        assert.deepEqual(message.to, ["owner@example.com"]);
        assert.equal(message.reply_to, lead.email);
        assert.match(message.text, /Sample & Co/);
        assert.match(message.text, /boardnbyte\.vercel\.app\/admin\/leads/);
        assert.ok(message.html.includes("&lt;responsive&gt;"));
        assert.ok(message.html.includes("&amp; an admin"));
    } finally {
        if (previous === undefined) delete process.env.LEAD_NOTIFICATION_EMAIL;
        else process.env.LEAD_NOTIFICATION_EMAIL = previous;
    }
});

test("missing provider settings disables email notifications safely", () => {
    const keys = ["RESEND_API_KEY", "LEAD_FROM_EMAIL", "LEAD_NOTIFICATION_EMAIL"];
    const old = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
    keys.forEach((k) => delete process.env[k]);
    try {
        assert.equal(isConfigured("owner"), false);
        assert.equal(isConfigured("customer"), false);
        process.env.RESEND_API_KEY = "test-key";
        process.env.LEAD_FROM_EMAIL = "BNB <info@example.com>";
        assert.equal(isConfigured("customer"), true);
        assert.equal(isConfigured("owner"), false);
        process.env.LEAD_NOTIFICATION_EMAIL = "owner@example.com";
        assert.equal(isConfigured("owner"), true);
    } finally {
        keys.forEach((k) => {
            if (old[k] === undefined) delete process.env[k];
            else process.env[k] = old[k];
        });
    }
});

test("Resend request uses authorization and an idempotency key", async () => {
    let request;
    const transport = async (url, options) => {
        request = { url, options };
        return { ok: true, status: 200, json: async () => ({ id: "email-id-123" }) };
    };
    const original = process.env.RESEND_API_KEY;
    const from = process.env.LEAD_FROM_EMAIL;
    process.env.RESEND_API_KEY = "example-private-key";
    process.env.LEAD_FROM_EMAIL = "BNB <hello@example.com>";
    try {
        const receipt = await sendResendEmail(buildNotification(lead, "customer"), "bnb-lead-test-customer-v1", transport);
        assert.equal(receipt.id, "email-id-123");
        assert.equal(request.url, "https://api.resend.com/emails");
        assert.equal(request.options.headers["Authorization"], "Bearer example-private-key");
        assert.equal(request.options.headers["Idempotency-Key"], "bnb-lead-test-customer-v1");
        assert.equal(JSON.parse(request.options.body).from, "BNB <hello@example.com>");
    } finally {
        if (original === undefined) delete process.env.RESEND_API_KEY;
        else process.env.RESEND_API_KEY = original;
        if (from === undefined) delete process.env.LEAD_FROM_EMAIL;
        else process.env.LEAD_FROM_EMAIL = from;
    }
});

test("provider failures do not count as accepted", async () => {
    await assert.rejects(
        sendResendEmail({ to: ["customer@example.com"], text: "test" }, "failure-id", async () => ({
            ok: false,
            status: 403
        })),
        /HTTP 403/
    );
    await assert.rejects(
        sendResendEmail({ to: ["customer@example.com"], text: "test" }, "no-receipt", async () => ({
            ok: true,
            status: 200,
            json: async () => ({})
        })),
        /message ID/
    );
});
