const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Register new user
// @route   POST /register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: "Fill all fields" });
    }

    const exists = await User.findOne({ username });
    if (exists) return res.json({ success: false, message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashed, role: "user" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Register error" });
  }
};

// @desc    Auth user & get token
// @route   POST /login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
