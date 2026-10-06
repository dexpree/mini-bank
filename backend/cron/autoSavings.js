const cron = require("node-cron");
const Goal = require("../models/Goal");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

/*
Runs every day at midnight
*/

cron.schedule("0 0 * * *", async () => {

  console.log("🔁 Running Auto Saving Job");

  try {

    const goals = await Goal.find({
      autoSaveEnabled: true,
      isDisabled: false
    });

    for (const goal of goals) {

      const user = await User.findById(goal.userId);

      if (!user) continue;

      if (user.isBlocked || user.isFrozen) continue;

      const amount = goal.autoSaveAmount;

      if (!amount || amount <= 0) continue;

      if (user.balance < amount) continue;

      user.balance -= amount;

      goal.savedAmount += amount;

      if (goal.savedAmount >= goal.targetAmount) {
        goal.isCompleted = true;
      }

      await user.save();
      await goal.save();

      await Transaction.create({
        userId: user._id,
        type: "AUTO_GOAL_SAVE",
        amount: amount,
        balanceAfter: user.balance,
        description: `Auto saved for goal: ${goal.title}`
      });

      console.log(`✅ Auto saved ₹${amount} for ${user.email}`);

    }

  } catch (error) {

    console.log("Auto Saving Job Error:", error);

  }

});