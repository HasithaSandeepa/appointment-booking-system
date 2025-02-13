const Slot = require("../models/slotModel");

exports.getAvailableSlots = (req, res) => {
  Slot.findAllAvailable((err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.createSlot = (req, res) => {
  const { date, time } = req.body;

  Slot.create(date, time, (err, results) => {
    if (err) throw err;
    res.json({ message: "Slot created successfully" });
  });
};
