const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { loginUser } = require("./controllers/authController");
const leadRateLimit = require("./middleware/leadRateLimit");
const leadRoutes = require("./routes/leadRoutes");

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = new Set(
    (process.env.FRONTEND_ORIGIN || "https://boardnbyte.vercel.app")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
);

if (process.env.NODE_ENV !== "production") {
    allowedOrigins.add("http://localhost:3000");
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        const error = new Error("Origin is not permitted.");
        error.status = 403;
        return callback(error);
    },
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "no-referrer");
    res.set("Cache-Control", "no-store");
    return next();
});

app.use(express.json({ limit: "48kb" }));

app.get("/health", (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    return res.status(connected ? 200 : 503).json({
        status: connected ? "ok" : "unavailable"
    });
});

app.post("/api/auth/login", leadRateLimit, loginUser);
app.use("/api/leads", leadRoutes);

app.use((req, res) => {
    return res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const statusCode = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
        ? error.status
        : 500;
    return res.status(statusCode).json({
        message: statusCode === 500 ? "An unexpected server error occurred." : error.message
    });
});

const startServer = async () => {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
        throw new Error("MONGO_URI and JWT_SECRET must be set before starting.");
    }

    await connectDB();

    const port = process.env.PORT || 5000;
    return app.listen(port, "0.0.0.0", () => {
        console.log("BNB enquiries API is listening.");
    });
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error("Failed to start enquiries API:", error.message);
        process.exit(1);
    });
}

module.exports = { app, startServer };
