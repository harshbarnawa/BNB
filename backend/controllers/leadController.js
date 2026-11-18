const mongoose = require("mongoose");
const Lead = require("../model/Lead");
const { sendLeadNotification } = require("../utils/leadNotifications");

const { parseLeadPayload, statuses: leadStatuses } = require("../utils/leadValidation");
const clean = (value, limit) => typeof value === "string" ? value.trim().slice(0, limit + 1) : "";

const createLead = async (req, res) => {
    try {
        const body = req.body || {};

        if (body.website) {
            return res.status(202).json({ message: "Enquiry received." });
        }

        const parsed = parseLeadPayload(body);
        if (parsed.error) {
            return res.status(400).json({ message: parsed.error });
        }

        const lead = await Lead.create(parsed.value);
        const results = await Promise.allSettled([
            sendLeadNotification(lead, "owner"),
            sendLeadNotification(lead, "customer")
        ]);

        const customer = results[1].status === "fulfilled"
            ? results[1].value.status
            : "unavailable";

        return res.status(201).json({
            message: "Your enquiry has been received.",
            reference: lead.id,
            confirmationEmail: customer === "accepted" ? "accepted" : "unavailable"
        });
    } catch (error) {
        console.error("Create lead error:", error.message);
        return res.status(500).json({ message: "Unable to save your enquiry. Please try again." });
    }
};

const listLeads = async (req, res) => {
    try {
        const page = Math.max(1, Math.min(100000, Number.parseInt(req.query.page, 10) || 1));
        const limit = 20;
        const status = clean(req.query.status, 40);
        if (status && !leadStatuses.has(status)) {
            return res.status(400).json({ message: "Invalid status filter." });
        }

        const filter = status ? { status } : {};
        const [leads, total] = await Promise.all([
            Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Lead.countDocuments(filter)
        ]);

        res.set("Cache-Control", "no-store");
        return res.json({ leads, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error("List leads error:", error.message);
        return res.status(500).json({ message: "Unable to load enquiries." });
    }
};

const updateLead = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid enquiry ID." });
        }

        const body = req.body || {};
        const changes = {};
        if (Object.prototype.hasOwnProperty.call(body, "status")) {
            if (typeof body.status !== "string" || !leadStatuses.has(body.status)) {
                return res.status(400).json({ message: "Invalid enquiry status." });
            }
            changes.status = body.status;
        }
        if (Object.prototype.hasOwnProperty.call(body, "notes")) {
            if (typeof body.notes !== "string" || body.notes.length > 3000) {
                return res.status(400).json({ message: "Notes must be 3000 characters or fewer." });
            }
            changes.notes = body.notes.trim();
        }
        if (!Object.keys(changes).length) {
            return res.status(400).json({ message: "No valid changes supplied." });
        }

        const lead = await Lead.findByIdAndUpdate(req.params.id, { $set: changes }, {
            new: true, runValidators: true
        });

        if (!lead) return res.status(404).json({ message: "Enquiry not found." });
        res.set("Cache-Control", "no-store");
        return res.json({ message: "Enquiry updated.", lead });
    } catch (error) {
        console.error("Update lead error:", error.message);
        return res.status(500).json({ message: "Unable to update enquiry." });
    }
};

module.exports = { createLead, listLeads, updateLead };
