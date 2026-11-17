const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (req, res) => {
    res.send("BNB Backend is working!");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes.js"));
app.use("/api/orders", require("./routes/orderRoutes.js"));
app.use("/api/payments", require("./routes/paymentRoutes.js"));
app.use("/api/analytics", require("./routes/analyticsRoutes.js"));

app.use((error, req, res, next) => {
    console.error("API error:", error.message);

    if (res.headersSent) {
        return next(error);
    }

    const isUploadError = error.name === "MulterError" || error.message.startsWith("Only JPEG");
    const statusCode = isUploadError ? 400 : (error.status || error.statusCode || 500);

    return res.status(statusCode).json({
        message: statusCode >= 500 ? "An unexpected server error occurred" : error.message
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

if (require.main === module) {
    startServer();
}

module.exports = app;
