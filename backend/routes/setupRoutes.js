const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/create-admin", async (req, res) => {
  try {
    const exists = await User.findOne({ email: "admin@gmail.com" });
    if (exists) return res.json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      balance: 0,
      isBlocked: false
    });

    res.json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
