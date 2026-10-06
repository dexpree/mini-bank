const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    phone: { type: String, required: true, unique: true },

    dob: { type: String, required: true },

    gender: {
  type: String,
  enum: ["male", "female", "other"],
  lowercase: true,
  required: true
},


    address: { type: String, required: true },

    aadhaarNumber: { type: String, required: true, unique: true },

    panNumber: { type: String, required: true, unique: true },

    role: { 
      type: String, 
      enum: ["USER", "ADMIN"], 
      default: "USER" 
    },

    accountNumber: {
      type: String,
      unique: true,
      sparse: true // allows admin to not have account number
    },

    // ✅ Approval Flow
    isApproved: {
      type: Boolean,
      default: false
    },

    isRejected: {
      type: Boolean,
      default: false
    },

    // 💰 Balance
    balance: {
      type: Number,
      default: 0
    },

    // 🚫 Account Restrictions
    isBlocked: {
      type: Boolean,
      default: false
    },

    isFrozen: {
      type: Boolean,
      default: false
    },

    // ✅ NEW: Reason Fields
    blockReason: {
      type: String,
      default: ""
    },

    freezeReason: {
      type: String,
      default: ""
    },
    failedTransfers: { type: Number, default: 0 },

lastTransferAt: { type: Date }

  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
