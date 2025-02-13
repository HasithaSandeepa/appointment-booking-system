const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  // Set session time zone to Sri Lanka Standard Time (UTC +5:30)
  db.query("SET time_zone = '+05:30'", (err) => {
    if (err) {
      console.error("Failed to set session time zone:", err);
      return;
    }
    console.log("Connected to MySQL and session time zone set to UTC +5:30");
  });
});

module.exports = db;
