const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");

/* ------------------------------------------------ */
/* USER CONTROLLER */
/* ------------------------------------------------ */

const MIN_DEPOSIT = 100;
const MAX_DEPOSIT = 50000;
const MIN_WITHDRAW = 100;
const MAX_WITHDRAW = 20000;

/* 👤 Get Profile */


/* 💰 Deposit */
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
      return res.status(400).json({
        message: `Deposit must be between ₹${MIN_DEPOSIT} and ₹${MAX_DEPOSIT}`
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    // ✅ FREEZE CHECK
    if (user.isFrozen) {
      return res.status(403).json({ message: "Account is frozen. Cannot deposit." });
    }

    user.balance += Number(amount);
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "DEPOSIT",
      amount: Number(amount),
      balanceAfter: user.balance
    });

    res.json({ message: "Deposit successful", balance: user.balance });

  } catch (error) {
    console.log("Deposit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* 💸 Withdraw */
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) {
      return res.status(400).json({
        message: `Withdrawal must be between ₹${MIN_WITHDRAW} and ₹${MAX_WITHDRAW}`
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    // ✅ FREEZE CHECK
    if (user.isFrozen) {
      return res.status(403).json({ message: "Account is frozen. Cannot withdraw." });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= Number(amount);
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "WITHDRAW",
      amount: Number(amount),
      balanceAfter: user.balance
    });

    res.json({ message: "Withdrawal successful", balance: user.balance });

  } catch (error) {
    console.log("Withdraw Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* 📄 User Transactions */
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.log("Transaction Fetch Error:", error);
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
    user.isApproved = false;

    await user.save();

    res.json({ message: "User rejected ❌", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* GET USER PROFILE */

exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* UPDATE PROFILE */

exports.updateProfile = async (req, res) => {
  try {

    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    console.log("Update Profile Error:", error);

    res.status(500).json({ message: "Server error" });
  }
};


/* CHANGE PASSWORD */

exports.changePassword = async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password changed successfully"
    });

  } catch (error) {

    console.log("Change Password Error:", error);

    res.status(500).json({ message: "Server error" });

  }

};
