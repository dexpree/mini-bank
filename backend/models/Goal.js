const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: { type: String, required: true },

    category: { type: String, default: "EMERGENCY" },

    targetAmount: { type: Number, required: true },

    savedAmount: { type: Number, default: 0 },

    deadline: { type: Date, default: null },

    isLocked: { type: Boolean, default: false },

    isCompleted: { type: Boolean, default: false },

    // ✅ NEW
    isDisabled: { type: Boolean, default: false },

    // ✅ Auto Saving
    autoSaveEnabled: { type: Boolean, default: false },
    autoSaveAmount: { type: Number, default: 0 },
    autoSaveFrequency: {
      type: String,
      enum: ["WEEKLY", "MONTHLY"],
      default: "MONTHLY"
    },
    recommendedWeekly: {
  type: Number,
  default: 0
},

recommendedMonthly: {
  type: Number,
  default: 0
},
    nextAutoSaveDate: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
