const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, appointmentController.bookAppointment);
router.get("/", authenticate, appointmentController.getUserAppointments);
router.get("/all", authenticate, appointmentController.getAllAppointments);
router.delete("/:id", authenticate, appointmentController.cancelAppointment);

module.exports = router;
