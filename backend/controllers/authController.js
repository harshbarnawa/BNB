
const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({
            email: normalizedEmail
        });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        try {
            await sendEmail(
                user.email,
                "Welcome to BNB!",
                `Hello ${user.name},

Welcome to Board N Byte!

Your account has been successfully created.

Thank you for joining BNB.`
            );
        } catch (emailError) {
            console.error("Email Error:", emailError.message);
        }

        return res.status(201).json({
            message: "User registered successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Server error during registration"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Server error during login"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            message: "Unable to fetch users"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
};
