const Goal = require("../models/Goal");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

/* =================================
   📊 Calculate Recommended Savings Plan
================================= */

const calculateSavingsPlan = (targetAmount, deadline) => {

  if (!deadline) {
    return {
      weeklyAmount: 0,
      monthlyAmount: 0
    };
  }

  const today = new Date();
  const endDate = new Date(deadline);

  const diffTime = endDate - today;

  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const weeks = Math.ceil(totalDays / 7);
  const months = Math.ceil(totalDays / 30);

  const weeklyAmount = Math.ceil(targetAmount / weeks);
  const monthlyAmount = Math.ceil(targetAmount / months);

  return {
    weeklyAmount,
    monthlyAmount
  };
};


/* =================================
   🎯 Create Goal
================================= */

exports.createGoal = async (req, res) => {
  try {

    const {
      title,
      targetAmount,
      deadline,
      category,
      isLocked,
      autoSaveEnabled,
      autoSaveAmount,
      autoSaveFrequency
    } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({
        message: "Title and Target Amount required"
      });
    }

    if (Number(targetAmount) <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than 0"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Account is blocked" });

    if (user.isFrozen)
      return res.status(403).json({ message: "Account is frozen" });

    // ⭐ Smart saving calculation
    const savingsPlan = calculateSavingsPlan(Number(targetAmount), deadline);

    const goal = await Goal.create({

      userId: req.user._id,
      title,
      category: category || "EMERGENCY",

      targetAmount: Number(targetAmount),
      savedAmount: 0,

      deadline: deadline ? new Date(deadline) : null,

      isLocked: isLocked || false,
      isCompleted: false,
      isDisabled: false,

      autoSaveEnabled: autoSaveEnabled || false,
      autoSaveAmount: autoSaveEnabled ? Number(autoSaveAmount) : 0,
      autoSaveFrequency: autoSaveFrequency || "MONTHLY",
      nextAutoSaveDate: autoSaveEnabled ? new Date() : null,

      // ⭐ NEW SMART SAVING PLAN
      recommendedWeekly: savingsPlan.weeklyAmount,
      recommendedMonthly: savingsPlan.monthlyAmount
    });

    res.status(201).json(goal);

  } catch (error) {

    console.log("Create Goal Error:", error);

    res.status(500).json({
      message: "Goal creation failed"
    });

  }
};


/* =================================
   📄 Get User Goals
================================= */

exports.getGoals = async (req, res) => {
  try {

    const goals = await Goal.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(goals);

  } catch (error) {

    console.log("Get Goals Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* =================================
   💰 Add Money To Goal
================================= */

exports.addToGoal = async (req, res) => {
  try {

    const { goalId, amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized goal access"
      });
    }

    if (goal.isDisabled) {
      return res.status(403).json({
        message: "Goal is disabled ❌"
      });
    }

    const user = await User.findById(req.user._id);

    if (user.balance < Number(amount)) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

    user.balance -= Number(amount);
    goal.savedAmount += Number(amount);

    if (goal.savedAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await user.save();
    await goal.save();

    await Transaction.create({
      userId: user._id,
      type: "GOAL_DEPOSIT",
      amount: Number(amount),
      balanceAfter: user.balance
    });

    res.json({
      message: "Amount added to goal successfully",
      goal,
      balance: user.balance
    });

  } catch (error) {

    console.log("Add To Goal Error:", error);

    res.status(500).json({
      message: "Failed to add amount to goal"
    });

  }
};


/* =================================
   💸 Withdraw From Goal
================================= */

exports.withdrawFromGoal = async (req, res) => {
  try {

    const { goalId, amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Invalid withdrawal amount"
      });
    }

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    if (goal.isDisabled) {
      return res.status(403).json({
        message: "Goal is disabled ❌"
      });
    }

    const user = await User.findById(req.user._id);

    if (goal.isLocked && goal.deadline) {

      const today = new Date();
      const deadlineDate = new Date(goal.deadline);

      if (today < deadlineDate) {
        return res.status(403).json({
          message: `Goal locked until ${deadlineDate.toDateString()}`
        });
      }

    }

    if (goal.savedAmount < Number(amount)) {
      return res.status(400).json({
        message: "Insufficient goal balance"
      });
    }

    goal.savedAmount -= Number(amount);
    user.balance += Number(amount);

    if (goal.savedAmount < goal.targetAmount) {
      goal.isCompleted = false;
    }

    await goal.save();
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: "GOAL_WITHDRAW",
      amount: Number(amount),
      balanceAfter: user.balance,
      description: `Withdrawn from goal: ${goal.title}`
    });

    res.json({
      message: "Withdraw successful",
      goal,
      balance: user.balance
    });

  } catch (error) {

    console.log("Withdraw Goal Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* =================================
   💰 Withdraw Completed Goal
================================= */

exports.withdrawCompletedGoal = async (req, res) => {
  try {

    const goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    if (!goal.isCompleted) {
      return res.status(400).json({
        message: "Goal not completed yet"
      });
    }

    const user = await User.findById(req.user._id);

    const withdrawAmount = goal.savedAmount;

    // Transfer money to user
    user.balance += withdrawAmount;

    await user.save();

    // ❗ DO NOT RESET GOAL
    // goal.savedAmount = 0
    // goal.isCompleted = false

    await Transaction.create({
      userId: user._id,
      type: "GOAL_WITHDRAW",
      amount: withdrawAmount,
      balanceAfter: user.balance,
      description: `Completed goal withdrawal: ${goal.title}`
    });

    res.json({
      message: "Goal savings withdrawn successfully 💰",
      balance: user.balance
    });

  } catch (error) {

    console.log("Withdraw Completed Goal Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* =================================
   🔄 Toggle Auto Saving
================================= */

exports.toggleAutoSaving = async (req, res) => {
  try {

    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    goal.autoSaveEnabled = !goal.autoSaveEnabled;

    if (!goal.autoSaveEnabled) {
      goal.nextAutoSaveDate = null;
    } else {
      goal.nextAutoSaveDate = new Date();
    }

    await goal.save();

    res.json({
      message: goal.autoSaveEnabled
        ? "Auto Saving Enabled ✅"
        : "Auto Saving Disabled ❌",
      goal
    });

  } catch (error) {

    console.log("Toggle Auto Saving Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* =================================
   ❌ Delete Goal
================================= */

exports.deleteGoal = async (req, res) => {
  try {

    const goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    await Goal.findByIdAndDelete(req.params.goalId);

    res.json({
      message: "Goal deleted successfully ✅"
    });

  } catch (error) {

    console.log("Delete Goal Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


/* =================================
   🚫 Disable / Enable Goal
================================= */

exports.toggleDisableGoal = async (req, res) => {
  try {

    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    goal.isDisabled = !goal.isDisabled;

    if (goal.isDisabled) {
      goal.autoSaveEnabled = false;
      goal.nextAutoSaveDate = null;
    }

    await goal.save();

    res.json({
      message: goal.isDisabled
        ? "Goal Disabled Successfully ❌"
        : "Goal Enabled Successfully ✅",
      goal
    });

  } catch (error) {

    console.log("Toggle Disable Goal Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};