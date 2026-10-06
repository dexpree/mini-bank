const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  deposit,
  withdraw,
  getMyTransactions,
  updateProfile,
  changePassword
} = require("../controllers/userController");

/* 👤 User profile */
router.get("/profile", protect, getProfile);

/* 💰 Deposit money */
router.post("/deposit", protect, deposit);

/* 💸 Withdraw money */
router.post("/withdraw", protect, withdraw);

/* 📄 User transactions */
router.get("/transactions", protect, getMyTransactions);

router.put("/profile/update", protect, updateProfile);

router.put("/profile/change-password", protect, changePassword);

module.exports = router;
