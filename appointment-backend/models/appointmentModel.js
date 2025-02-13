const db = require("../config/db");

const Appointment = {
  create: (name, contact, slotId, userId, callback) => {
    db.query(
      "INSERT INTO appointments (name, contact, slot_id, user_id) VALUES (?, ?, ?, ?)",
      [name, contact, slotId, userId],
      callback
    );
  },

  getAll: (callback) => {
    db.query(
      `SELECT 
        appointments.id, 
        appointments.name, 
        appointments.contact, 
        DATE_FORMAT(slots.date, '%Y-%m-%d') AS date, 
        slots.time 
      FROM appointments 
      INNER JOIN slots ON appointments.slot_id = slots.id`,
      callback
    );
    (err) => {
      if (err) {
        return callback(err, null);
      }
    };
  },

  // // Find an appointment by ID
  findById: (id, callback) => {
    db.query(
      "SELECT * FROM appointments WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
        // Ensure that we are getting the first result (only one appointment should match)
        if (results.length > 0) {
          return callback(null, results[0]); // Return the first appointment if it exists
        } else {
          return callback(null, null); // No appointment found
        }
      }
    );
  },

  findByUserId: (userId, callback) => {
    db.query(
      `SELECT 
        appointments.id, 
        appointments.name, 
        appointments.contact, 
        DATE_FORMAT(slots.date, '%Y-%m-%d') AS date, 
        slots.time 
       FROM appointments 
       INNER JOIN slots ON appointments.slot_id = slots.id 
       WHERE appointments.user_id = ?`,
      [userId],
      callback
    );
  },

  delete: (id, userId, isAdmin, callback) => {
    // If the user is an admin, skip checking the user_id
    let query = "DELETE FROM appointments WHERE id = ?";
    let params = [id];

    // If the user is not an admin, ensure the appointment belongs to them
    if (!isAdmin) {
      query += " AND user_id = ?";
      params.push(userId);
    }

    db.query(query, params, callback);
  },
};

module.exports = Appointment;
