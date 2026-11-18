const mongoose = require("mongoose");
const Lead = require("../model/Lead");
const { buildNotification, isConfigured, sendResendEmail } = require("./leadMailer");

const audiences = new Set(["owner", "customer"]);

async function sendLeadNotification(lead, audience) {
    if (!audiences.has(audience)) throw new Error("Invalid notification audience.");

    const path = "notifications." + audience;
    const now = new Date();
    const claimed = await Lead.findOneAndUpdate(
        {
            _id: lead._id,
            [path + ".status"]: { $nin: ["accepted", "sending"] }
        },
        {
            $set: {
                [path + ".status"]: "sending",
                [path + ".lastAttemptAt"]: now,
                [path + ".failureReason"]: ""
            }
        },
        { new: true }
    );

    if (!claimed) return { status: "already_processed" };

    if (!isConfigured(audience)) {
        await Lead.updateOne(
            { _id: lead._id, [path + ".status"]: "sending" },
            { $set: { [path + ".status"]: "not_configured" } }
        );
        return { status: "not_configured" };
    }

    const email = buildNotification(claimed, audience);
    const idempotencyKey = "bnb-lead-" + String(lead._id) + "-" + audience + "-v1";

    let receipt;
    try {
        receipt = await sendResendEmail(email, idempotencyKey);
    } catch (error) {
        const reason = error.name === "TimeoutError"
            ? "Email provider timed out."
            : String(error.message || "Email provider error.").slice(0, 140);

        await Lead.updateOne(
            { _id: lead._id, [path + ".status"]: "sending" },
            { $set: { [path + ".status"]: "failed", [path + ".failureReason"]: reason } }
        );
        console.error("BNB notification failure:", audience, reason);
        return { status: "failed" };
    }

    try {
        await Lead.updateOne(
            { _id: lead._id, [path + ".status"]: "sending" },
            {
                $set: {
                    [path + ".status"]: "accepted",
                    [path + ".providerId"]: receipt.id,
                    [path + ".failureReason"]: ""
                }
            }
        );
    } catch (error) {
        console.error("Email accepted, but status update failed:", audience);
        return { status: "accepted", statusUpdateFailed: true };
    }

    return { status: "accepted" };
}

async function resendLeadNotification(req, res) {
    const { id, audience } = req.params;
    if (!mongoose.isValidObjectId(id) || !audiences.has(audience)) {
        return res.status(400).json({ message: "Invalid enquiry or notification type." });
    }

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Enquiry not found." });

    try {
        const result = await sendLeadNotification(lead, audience);
        res.set("Cache-Control", "no-store");
        return res.json({ message: "Notification attempt processed.", status: result.status });
    } catch (error) {
        console.error("Notification retry error:", error.message);
        return res.status(500).json({ message: "Unable to retry notification." });
    }
}

module.exports = { sendLeadNotification, resendLeadNotification };
