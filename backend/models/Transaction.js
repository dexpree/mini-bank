const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: [
  "DEPOSIT",
  "WITHDRAW",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "INTEREST",
  "GOAL_DEPOSIT",
  "GOAL_WITHDRAW",
  "AUTO_GOAL_SAVE"

],

      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    balanceAfter: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ""
    },


    // ✅ NEW FIELD
    note: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
