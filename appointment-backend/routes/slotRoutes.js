const express = require("express");
const slotController = require("../controllers/slotController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, slotController.getAvailableSlots);
router.post("/", authenticate, slotController.createSlot);

module.exports = router;
