const attempts = new Map();
const windowMs = 30 * 60 * 1000;
const maxRequests = 5;

const leadRateLimit = (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";

    if (attempts.size > 5000) {
        for (const [ip, entry] of attempts) {
            if (now - entry.started >= windowMs) attempts.delete(ip);
        }
    }

    const existing = attempts.get(key);

    if (!existing || now - existing.started >= windowMs) {
        attempts.set(key, { started: now, count: 1 });
        return next();
    }

    if (existing.count >= maxRequests) {
        res.set("Retry-After", String(Math.ceil((existing.started + windowMs - now) / 1000)));
        return res.status(429).json({ message: "Too many enquiries. Please try again later." });
    }

    existing.count += 1;
    return next();
};

module.exports = leadRateLimit;
