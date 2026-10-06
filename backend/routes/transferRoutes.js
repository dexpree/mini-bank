const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { transferMoney } = require("../controllers/transferController");

router.post("/", protect, transferMoney);

module.exports = router;
