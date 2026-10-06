const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const transferRoutes = require("./routes/transferRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();

const app = express();

/* ==============================
   🔐 CREATE DEFAULT ADMIN
============================== */

const createAdmin = async () => {
  try {

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      10
    );

    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,

      role: "ADMIN",   // ✅ IMPORTANT

      isApproved: true,
      isBlocked: false,
      isFrozen: false,

      balance: 0
    });

    console.log("🔥 Default Admin Created");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);

  } catch (err) {
    console.log("❌ Admin creation error:", err.message);
  }
};

/* ==============================
   📡 CONNECT DATABASE
============================== */

const startServer = async () => {
  try {

    await connectDB(); // ✅ your existing DB function

    console.log("✅ MongoDB Connected");

    await createAdmin(); // ⭐ ADD THIS

    require("./cron/autoSavings");

    /* 🔹 MIDDLEWARE */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
      origin: "http://localhost:5173",
      credentials: true
    }));

    /* 🔹 ROUTES */
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/user", require("./routes/userRoutes"));
    app.use("/api/admin", require("./routes/adminRoutes"));
    app.use("/api/goals", require("./routes/goalRoutes"));
    app.use("/api/transfer", transferRoutes);
    app.use("/api/feedback", feedbackRoutes);

    /* 🔹 TEST ROUTE */
    app.get("/", (req, res) => {
      res.send("Mini Bank API is running...");
    });

    /* 🔹 START SERVER */
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("❌ Server start error:", err.message);
  }
};

startServer();