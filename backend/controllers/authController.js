const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ─── registerUser ────────────────────────────────────────────────────────────

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // H-6: validate all required fields before touching the database
    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    // Minimum password length
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.trim().toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── loginUser ───────────────────────────────────────────────────────────────

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // C-4 + L-2: use the same message and status for wrong email OR wrong password
    // so callers cannot determine whether an email is registered (user enumeration fix)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
