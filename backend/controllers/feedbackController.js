const Feedback = require("../models/Feedback");
const User = require("../models/User");

// ✅ User Create Feedback
exports.createFeedback = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      userId: req.user.id,
      subject,
      message
    });

    res.status(201).json({
      message: "Feedback sent successfully ✅",
      feedback
    });

  } catch (error) {
    console.log("Create Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ User View Own Feedback
exports.getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (error) {
    console.log("Get My Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
