const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const generateAccountNumber = require("../utils/generateAccountNumber");

/* ------------------------------------------------ */
/* REGISTER USER */
/* ------------------------------------------------ */

exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
      dob,
      gender,
      address,
      aadhaarNumber,
      panNumber
    } = req.body;

    /* ✅ Validation */

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !dob ||
      !gender ||
      !address ||
      !aadhaarNumber ||
      !panNumber
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    /* ✅ Check existing user */

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    /* ✅ Hash password */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ✅ Create user */

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      dob,
      gender,
      address,
      aadhaarNumber,
      panNumber,
      role: "USER",
      accountNumber: generateAccountNumber(),
      balance: 0,
      isApproved: false
    });

    /* ✅ Response */

    res.status(201).json({
      message: "User registered successfully ✅",
      token: generateToken(user)
    });

  } catch (error) {

    console.error("Register Error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* ------------------------------------------------ */
/* LOGIN USER */
/* ------------------------------------------------ */

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    /* ✅ Find user */

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    /* ❌ Rejected account */

    if (user.isRejected) {
      return res.status(403).json({
        message: "Your account was rejected by admin ❌"
      });
    }

    /* 🚫 Blocked account */

    if (user.isBlocked) {
      return res.status(403).json({
        message: `Account blocked: ${user.blockReason}`
      });
    }

    /* ❄ Frozen account */

    if (user.isFrozen) {
      return res.status(403).json({
        message: `Account frozen: ${user.freezeReason}`
      });
    }

    /* ✅ Check password */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    /* ✅ Approval check */

    if (user.role !== "ADMIN" && !user.isApproved) {
      return res.status(403).json({
        message: "Account not approved. Please wait for admin approval ❌"
      });
    }

    /* ✅ Login success */

    return res.json({
      token: generateToken(user),
      message: "Login successful ✅"
    });

  } catch (error) {

    console.log("Login Error:", error);

    return res.status(500).json({
      message: "Server error"
    });

  }
};