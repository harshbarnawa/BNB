const User = require("../model/User.js");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = new User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `
            Welcome to BNB! Your OTP for registration is: ${otp}
            Please enter this OTP to complete your registration.
            If you did not request this, please ignore this message.
            `;

            await sendEmail(email, "Welcome to BNB - Your OTP for Registration", message);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
          
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};