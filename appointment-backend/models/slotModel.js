const db = require("../config/db");

const Slot = {
  findAllAvailable: (callback) => {
    db.query("SELECT * FROM slots WHERE available = 1", callback);
  },

  updateAvailability: (slotId, available, callback) => {
    db.query(
      "UPDATE slots SET available = ? WHERE id = ?",
      [available, slotId],
      callback
    );
  },

  create: (date, time, callback) => {
    db.query(
      "INSERT INTO slots (date, time, available) VALUES (?, ?, 1)",
      [date, time],
      callback
    );
  },

  checkAvailability: (slotId, callback) => {
    db.query(
      "SELECT available FROM slots WHERE id = ?",
      [slotId],
      (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, null); // Slot not found
        callback(null, results[0]); // Return slot details
      }
    );
  },
};

module.exports = Slot;
