const Appointment = require("../models/appointmentModel");
const Slot = require("../models/slotModel");

exports.bookAppointment = (req, res) => {
  const { name, contact, slotId } = req.body;

  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const userId = req.user.id;

  // Check if slot is still available before booking
  Slot.checkAvailability(slotId, (err, slot) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!slot || slot.is_available === 0) {
      return res.status(400).json({ error: "Selected slot is not available" });
    }

    // Create an appointment
    Appointment.create(name, contact, slotId, userId, (err, results) => {
      if (err)
        return res.status(500).json({ error: "Failed to book appointment" });

      // Update slot availability
      Slot.updateAvailability(slotId, 0, (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Failed to update slot availability" });

        res.json({ message: "Appointment booked successfully!" });
      });
    });
  });
};

exports.getAllAppointments = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  Appointment.getAll((err, results) => {
    if (err)
      return res.status(500).json({ error: "Failed to fetch appointments" });
    res.json(results);
  });
};

exports.getUserAppointments = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const userId = req.user.id;

  Appointment.findByUserId(userId, (err, results) => {
    if (err)
      return res.status(500).json({ error: "Failed to fetch appointments" });
    res.json(results);
  });
};

exports.cancelAppointment = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role; // assuming the role is available

  // Check if the user is an admin
  const isAdmin = userRole === "admin";

  Appointment.findById(id, (err, appointment) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch appointment" });
    }

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Admin can delete any appointment, otherwise check if it's the user's own appointment
    Appointment.delete(id, userId, isAdmin, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to cancel appointment" });
      }

      // Mark the slot as available again
      Slot.updateAvailability(appointment.slot_id, 1, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to update slot availability" });
        }

        res.json({ message: "Appointment canceled successfully!" });
      });
    });
  });
};
