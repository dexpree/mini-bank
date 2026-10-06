const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createFeedback,
  getMyFeedbacks
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", protect, createFeedback);
router.get("/my", protect, getMyFeedbacks);

module.exports = router;
