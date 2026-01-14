const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ===============================
// Generate JWT Token
// ===============================
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ===============================
// Set token in cookie (DEV SAFE)
// ===============================
const setTokenCookie = (res, token) => {
  try {
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    console.error("❌ COOKIE ERROR:", err);
  }
};

// ===============================
// Register User
// ===============================
exports.register = async (req, res) => {
  console.log("Register function called");

  try {
    const { name, email, password } = req.body;
    console.log("Request body:", { name, email, password: "****" });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // ✅ SEND TOKEN IN RESPONSE TOO
    return res.status(201).json({
      success: true,
      token: token, // ✅ ADD THIS LINE
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("🔥 REGISTER ERROR FULL:", error);
    console.error("🔥 STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
};

// ===============================
// Login User
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // ✅ SEND TOKEN IN RESPONSE TOO
    return res.status(200).json({
      success: true,
      token: token, // ✅ ADD THIS LINE
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Current User
// ===============================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Logout
// ===============================
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
