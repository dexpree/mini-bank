const User = require("../models/User");
const Transaction = require("../models/Transaction");

const LARGE_TRANSFER_LIMIT = 50000; // ₹50,000
const FRAUD_TRANSFER_LIMIT = 150000; // ₹1,50,000 in 1 minute
const MAX_TRANSFER_LIMIT = 50000; // ₹50,000 per transaction

exports.transferMoney = async (req, res) => {
  try {
    const { receiverAccountNumber, amount } = req.body;

    if (!receiverAccountNumber || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transferAmount = Number(amount);

    if (transferAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (transferAmount > MAX_TRANSFER_LIMIT) {
      return res.status(400).json({
        message: `Transfer limit exceeded. Maximum per transaction is ₹${MAX_TRANSFER_LIMIT}`
      });
    }

    const sender = await User.findById(req.user.id);

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (sender.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    if (sender.isFrozen) {
      return res.status(403).json({ message: "Your account is frozen" });
    }

    if (sender.balance < transferAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const receiver = await User.findOne({
      accountNumber: receiverAccountNumber
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver._id.toString() === sender._id.toString()) {
      return res.status(400).json({
        message: "You cannot transfer money to yourself"
      });
    }

    if (receiver.isBlocked) {
      return res.status(403).json({ message: "Receiver account is blocked" });
    }

    /* ------------------------------------------------ */
    /* 🚨 FRAUD DETECTION SYSTEM */
    /* ------------------------------------------------ */

    const now = new Date();

    // 🚨 Rule 1 — Large Transfer Attempt
    if (transferAmount >= LARGE_TRANSFER_LIMIT) {

      await User.updateOne(
        { _id: sender._id },
        {
          isFrozen: true,
          freezeReason: `Suspicious large transfer attempt of ₹${transferAmount}`
        }
      );

      return res.status(403).json({
        message: "Account frozen due to suspicious large transfer 🚨"
      });
    }

    // 🚨 Rule 2 — Transfers ≥ ₹150000 within 1 minute

    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    const recentTransfers = await Transaction.find({
      userId: sender._id,
      type: "TRANSFER_OUT",
      createdAt: { $gte: oneMinuteAgo }
    });

    let totalAmount = 0;

    recentTransfers.forEach((tx) => {
      totalAmount += tx.amount;
    });

    if (totalAmount + transferAmount >= FRAUD_TRANSFER_LIMIT) {

      await User.updateOne(
        { _id: sender._id },
        {
          isFrozen: true,
          freezeReason:
            "Suspicious activity: Transfers exceeded ₹150000 within 1 minute"
        }
      );

      return res.status(403).json({
        message: "Account frozen due to high transfer activity 🚨"
      });
    }

    /* ------------------------------------------------ */
    /* 💸 NORMAL TRANSFER */
    /* ------------------------------------------------ */

    await Promise.all([
      User.updateOne(
        { _id: sender._id },
        { $inc: { balance: -transferAmount } }
      ),

      User.updateOne(
        { _id: receiver._id },
        { $inc: { balance: transferAmount } }
      )
    ]);

    const updatedSender = await User.findById(sender._id);
    const updatedReceiver = await User.findById(receiver._id);

    /* ------------------------------------------------ */
    /* 🧾 TRANSACTION RECORDS */
    /* ------------------------------------------------ */

    await Transaction.create({
      userId: sender._id,
      type: "TRANSFER_OUT",
      amount: transferAmount,
      balanceAfter: updatedSender.balance,
      note: `Transferred to ${receiver.name} (${receiver.accountNumber})`
    });

    await Transaction.create({
      userId: receiver._id,
      type: "TRANSFER_IN",
      amount: transferAmount,
      balanceAfter: updatedReceiver.balance,
      note: `Received from ${sender.name} (${sender.accountNumber})`
    });

    res.json({
      message: `₹${transferAmount} transferred successfully to ${receiver.name} ✅`,
      senderBalance: updatedSender.balance
    });

  } catch (error) {
    console.log("Transfer Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
