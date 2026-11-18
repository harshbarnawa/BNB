const SERVICE_LABELS = Object.freeze({
    business: "Business websites",
    commerce: "E-commerce websites",
    portfolio: "Portfolio websites",
    saas: "SaaS & dashboards",
    landing: "Landing pages",
    custom: "Custom web applications"
});

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
})[character]);

const emailLayout = (heading, subtitle, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="background:#f2f5f1;margin:0;padding:32px 16px;font-family:Arial,sans-serif;color:#17231c"><table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin:0 auto;background:#fff;border:1px solid #dfebe1"><tr><td style="padding:26px 32px;background:#15221a;color:#fff;font-weight:bold;font-size:21px;letter-spacing:2px">BNB <span style="color:#16B98A;font-size:12px;letter-spacing:1px">BOARD N BYTE</span></td></tr><tr><td style="padding:38px 32px"><p style="color:#168766;font-size:11px;letter-spacing:2px;font-weight:bold;margin:0 0 16px">BNB / DIGITAL SERVICES</p><h1 style="font-size:29px;line-height:1.2;letter-spacing:-1px;margin:0 0 14px">${heading}</h1><p style="font-size:14px;color:#596d60;line-height:1.8;margin:0 0 28px">${subtitle}</p>${body}</td></tr><tr><td style="background:#f1f6f1;padding:22px 32px;color:#758579;font-size:11px;line-height:1.7">Board N Byte · Digital services & technology<br>This is a transactional message regarding a project enquiry.</td></tr></table></body></html>`;

const detailLine = (label, value) => `<tr><td style="padding:9px 12px;font-size:12px;color:#68776b;border-bottom:1px solid #e1eae1;vertical-align:top">${escapeHtml(label)}</td><td style="padding:9px 12px;font-size:12px;font-weight:bold;border-bottom:1px solid #e1eae1;vertical-align:top;overflow-wrap:anywhere">${escapeHtml(value || "Not provided")}</td></tr>`;

function buildNotification(lead, audience) {
    const reference = String(lead.id || lead._id);
    const service = SERVICE_LABELS[lead.serviceId] || lead.serviceId;
    if (audience === "customer") {
        const plain = [
            `Hi ${lead.name},`,
            "",
            "Thank you for reaching out to Board N Byte!",
            "We've received your project enquiry and will review the details.",
            "Service: " + service,
            "Reference: " + reference,
            "",
            "We'll contact you using the details you provided after reviewing your request.",
            "This acknowledgement does not confirm a quotation, timeline or booking.",
            "",
            "Board N Byte | Digital Services"
        ].join("\n");
        const body = `<p style="font-size:14px;line-height:1.8">Hi <strong>${escapeHtml(lead.name)}</strong>,</p><p style="font-size:14px;line-height:1.8">Thank you for reaching out! We've received your project enquiry and will review the details.</p><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f2f7f2;margin:26px 0">${detailLine("Service", service)}${detailLine("Reference", reference)}</table><p style="font-size:13px;line-height:1.8;color:#526657">We'll get in touch using the details you provided. This acknowledgement does not confirm a quotation, timeline or booking.</p><p style="font-size:14px;font-weight:bold;margin-top:26px">Thanks,<br>Team BNB</p>`;
        return {
            to: [lead.email],
            ...(process.env.LEAD_REPLY_TO_EMAIL || process.env.LEAD_NOTIFICATION_EMAIL
                ? { reply_to: process.env.LEAD_REPLY_TO_EMAIL || process.env.LEAD_NOTIFICATION_EMAIL }
                : {}),
            subject: "We received your enquiry | Board N Byte",
            text: plain,
            html: emailLayout("Thanks for your enquiry.", "Your project is on our radar.", body)
        };
    }

    if (audience !== "owner") throw new Error("Invalid notification audience.");

    const recipient = process.env.LEAD_NOTIFICATION_EMAIL;
    const plain = [
        "New BNB project enquiry",
        "Reference: " + reference,
        "Name: " + lead.name,
        "Email: " + lead.email,
        "Phone: " + (lead.phone || "Not provided"),
        "Company: " + (lead.company || "Not provided"),
        "Service: " + service,
        "Budget: " + (lead.budget || "Not provided"),
        "",
        "Requirements:",
        lead.requirements,
        "",
        "Manage this lead: https://boardnbyte.vercel.app/admin/leads"
    ].join("\n");
    const body = `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f2f7f2;margin:10px 0 24px">${detailLine("Reference", reference)}${detailLine("Customer", lead.name)}${detailLine("Email", lead.email)}${detailLine("Phone", lead.phone)}${detailLine("Company", lead.company)}${detailLine("Service", service)}${detailLine("Budget", lead.budget)}</table><h2 style="font-size:15px">Project requirements</h2><p style="white-space:pre-wrap;font-size:13px;line-height:1.8;overflow-wrap:anywhere">${escapeHtml(lead.requirements)}</p><a href="https://boardnbyte.vercel.app/admin/leads" style="display:inline-block;background:#15221a;color:#fff;text-decoration:none;font-size:12px;font-weight:bold;padding:15px 22px;margin-top:14px">Open BNB Leads Dashboard &rarr;</a>`;
    return {
        to: [recipient],
        subject: "New BNB enquiry — " + service,
        reply_to: lead.email,
        text: plain,
        html: emailLayout("New project enquiry.", "A potential client has submitted the BNB enquiry form.", body)
    };
}

function isConfigured(audience) {
    return Boolean(
        process.env.RESEND_API_KEY &&
        process.env.LEAD_FROM_EMAIL &&
        (audience === "customer" || process.env.LEAD_NOTIFICATION_EMAIL)
    );
}

async function sendResendEmail(message, idempotencyKey, transport = fetch) {
    const response = await transport("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.RESEND_API_KEY,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL, ...message }),
        signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
        throw new Error("Email provider returned HTTP " + response.status);
    }

    const data = await response.json();
    if (!data || typeof data.id !== "string") {
        throw new Error("Email provider did not return a message ID.");
    }
    return { id: data.id };
}

module.exports = { buildNotification, isConfigured, sendResendEmail };
