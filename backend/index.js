
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();


app.get("/", (req, res) => {
    res.send("BNB Backend is working!");
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));
// app.use('/api/payments', require('./routes/paymentRoutes.js'));
// app.use('/api/analytics', require('./routes/analyticsRoutes.js'));




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
