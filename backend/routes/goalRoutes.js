const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  addToGoal,
  withdrawFromGoal,
  toggleAutoSaving,
  deleteGoal,
  toggleDisableGoal,
  withdrawCompletedGoal
} = require("../controllers/goalController");

const router = express.Router();

// Create goal
router.post("/", protect, createGoal);

// Get goals
router.get("/", protect, getGoals);

// Add money
router.post("/add", protect, addToGoal);

// Withdraw money
router.post("/withdraw", protect, withdrawFromGoal);

// Toggle auto saving
router.put("/toggle-auto/:goalId", protect, toggleAutoSaving);

// Disable/Enable goal
router.put("/disable-goal/:goalId", protect, toggleDisableGoal);

// Delete goal
router.delete("/delete/:goalId", protect, deleteGoal);

router.post("/withdraw-completed/:goalId", protect, withdrawCompletedGoal);

module.exports = router;
