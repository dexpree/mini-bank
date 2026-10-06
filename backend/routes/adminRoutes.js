const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { toggleFreezeUser } = require("../controllers/adminController");

const { getDisabledGoals } = require("../controllers/adminController");
const { approveUser } = require("../controllers/adminController");


const {
  getAllUsers,
  toggleBlockUser,
  addInterest,
  getAllTransactions,
  getAllGoals,
  createUserByAdmin,
  getAutoSavingUsers,
  enableGoal,
  deleteUser,
  rejectUser,
  getAllFeedbacks,
  replyFeedback,
  resolveFeedback,
  updateUser,
  getUserDetails,
  getAdminStats

} = require("../controllers/adminController");


/* 👥 View all users */
router.get("/users", protect, adminOnly, getAllUsers);

/* 🚫 Block / Unblock user */
router.put("/block/:id", protect, adminOnly, toggleBlockUser);

/* 💰 Add interest */
router.post("/add-interest", protect, adminOnly, addInterest);

/* 📄 View all transactions */
router.get("/transactions", protect, adminOnly, getAllTransactions);

/* ➕ Create user by admin */
router.post("/create-user", protect, adminOnly, createUserByAdmin);

/* 🎯 View all goals */
router.get("/goals", protect, adminOnly, getAllGoals);

router.put("/approve-user/:id", protect, adminOnly, approveUser);

router.put("/freeze/:id", protect, adminOnly, toggleFreezeUser);

router.put("/users/:id", protect, adminOnly, updateUser);


router.get("/auto-savings", protect, adminOnly, getAutoSavingUsers);

router.get("/disabled-goals", protect, adminOnly, getDisabledGoals);

router.get("/feedbacks", protect, adminOnly, getAllFeedbacks);
router.put("/feedbacks/reply/:id", protect, adminOnly, replyFeedback);
router.put("/feedbacks/resolve/:id", protect, adminOnly, resolveFeedback);


// ✅ Enable disabled goal
router.put("/enable-goal/:id", protect, adminOnly, enableGoal);

router.delete("/delete-user/:id", protect, adminOnly, deleteUser);
router.put("/reject-user/:id", protect, adminOnly, rejectUser);


router.put("/update-user/:id", protect, adminOnly, updateUser);
router.get("/user-details/:id", protect, adminOnly, getUserDetails);
router.get("/stats", protect, adminOnly, getAdminStats);


module.exports = router;
