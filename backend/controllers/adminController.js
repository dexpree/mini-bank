const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");
const generateAccountNumber = require("../utils/generateAccountNumber");
const Goal = require("../models/Goal");
const Feedback = require("../models/Feedback");

/* 👥 View All Users */
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* 🚫 Block / Unblock User (With Reason) */
exports.toggleBlockUser = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot block admin" });
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked;

    if (user.isBlocked) {
      user.blockReason = reason || "Violation of bank policy.";
    } else {
      user.blockReason = "";
    }

    await user.save();

    res.json({
      message: user.isBlocked
        ? "User blocked successfully 🚫"
        : "User unblocked successfully ✅",
      user
    });

  } catch (error) {
    console.log("Block User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* 💰 Add Interest to All Users */
exports.addInterest = async (req, res) => {
  const { rate } = req.body;

  if (!rate || rate <= 0) {
    return res.status(400).json({ message: "Invalid interest rate" });
  }

  const users = await User.find({ role: "USER", isBlocked: false });

  for (let user of users) {
    const interest = (user.balance * rate) / 100;
    user.balance += interest;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "INTEREST",
      amount: interest,
      balanceAfter: user.balance
    });
  }

  res.json({
    message: `Interest of ${rate}% added to all users`
  });
};

/* 📄 View All Transactions */
exports.getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find()
    .populate("userId", "name email accountNumber")
    .sort({ createdAt: -1 });

  res.json(transactions);
};

/* ➕ Create User by Admin */
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, dob, gender, address, aadhaarNumber, panNumber } = req.body;

    if (!name || !email || !password || !phone || !dob || !gender || !address || !aadhaarNumber || !panNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      dob,
      gender: gender.toLowerCase(),
      address,
      aadhaarNumber,
      panNumber,
      role: "USER",
      accountNumber: generateAccountNumber(),
      balance: 0,
      isApproved: false 
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.log("Create User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Admin already approved" });
    }

    user.isApproved = true;
    user.isRejected = false;   // ✅ important reset

    await user.save();

    res.json({ message: "User Approved Successfully ✅", user });
  } catch (error) {
    console.log("Approve User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot reject admin" });
    }

    user.isRejected = true;
    user.isApproved = false;   // ✅ make sure login blocked

    await user.save();

    res.json({ message: "User Rejected Successfully ❌", user });
  } catch (error) {
    console.log("Reject User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully ✅" });
  } catch (error) {
    console.log("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* 🎯 Admin: View All Goals */
exports.getAllGoals = async (req, res) => {
  const goals = await Goal.find()
    .populate("userId", "name email accountNumber");

  res.json(goals);
};

/* ❄ Freeze / Unfreeze User (With Reason) */
exports.toggleFreezeUser = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot freeze admin" });
    }

    // Toggle freeze
    user.isFrozen = !user.isFrozen;

    if (user.isFrozen) {
      user.freezeReason = reason || "Suspicious activity detected.";
    } else {
      user.freezeReason = "";
    }

    await user.save();

    res.json({
      message: user.isFrozen
        ? "User account frozen ❄"
        : "User account unfrozen ✅",
      user
    });

  } catch (error) {
    console.log("Freeze User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAutoSavingUsers = async (req, res) => {
  try {
    const goals = await Goal.find({ autoSaveEnabled: true })
      .populate("userId", "name email accountNumber balance isFrozen isBlocked")
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    console.log("Admin AutoSaving Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET Disabled Goals
exports.getDisabledGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ isDisabled: true })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    console.log("Get Disabled Goals Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ENABLE Disabled Goal
exports.enableGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    goal.isDisabled = false;
    await goal.save();

    res.json({ message: "Goal enabled successfully ✅", goal });
  } catch (error) {
    console.log("Enable Goal Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin view all feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "name email accountNumber")
      .sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (error) {
    console.log("Admin Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin reply feedback
exports.replyFeedback = async (req, res) => {
  try {
    const { reply } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    feedback.adminReply = reply;
    feedback.status = "REPLIED";

    await feedback.save();

    res.json({ message: "Reply sent successfully ✅", feedback });

  } catch (error) {
    console.log("Reply Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Mark resolved
exports.resolveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    feedback.status = "RESOLVED";
    await feedback.save();

    res.json({ message: "Feedback marked resolved ✅" });

  } catch (error) {
    console.log("Resolve Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {

    const {
      name,
      phone,
      address,
      gender,
      dob,
      aadhaarNumber,
      panNumber
    } = req.body;

    const updateData = {
      name,
      phone,
      address,
      dob,
      aadhaarNumber,
      panNumber
    };

    if (gender) {
      updateData.gender = gender.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });

  } catch (error) {

    console.log("Update User Error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getUserDetails = async (req, res) => {
  try {

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 });

    const goals = await Goal.find({ userId: user._id });

    res.json({
      user,
      transactions,
      goals
    });

  } catch (error) {

    console.log("Admin User Details Error:", error);

    res.status(500).json({ message: "Server error" });

  }
};

exports.getAdminStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({ role: "USER" });

    const totalBalanceData = await User.aggregate([
      { $match: { role: "USER" } },
      { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
    ]);

    const totalBalance = totalBalanceData[0]?.totalBalance || 0;

    const totalTransactions = await Transaction.countDocuments();

    const frozenAccounts = await User.countDocuments({ isFrozen: true });

    const blockedAccounts = await User.countDocuments({ isBlocked: true });

    res.json({
      totalUsers,
      totalBalance,
      totalTransactions,
      frozenAccounts,
      blockedAccounts
    });

  } catch (error) {

    console.log("Admin Stats Error:", error);

    res.status(500).json({ message: "Server error" });

  }
};