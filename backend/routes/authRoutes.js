const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controllers/authController.js");
const { protect } = require("../middleware/authMIddleware.js");
const { admin } = require("../middleware/adminMIddleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);

module.exports = router;