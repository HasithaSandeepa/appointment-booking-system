const db = require("../config/db.js");

const User = {
  create: (
    name,
    contact,
    email,
    password,
    role = "user",
    profile_pic,
    callback
  ) => {
    db.query(
      "INSERT INTO users (name, contact, email, password, role, profile_pic) VALUES (?, ?, ?, ?, ?, ?)",
      [name, contact, email, password, role, profile_pic], // Include profile_pic in the query
      callback
    );
  },

  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  findById: (id, callback) => {
    db.query(
      "SELECT id, name, contact, email, role, profile_pic FROM users WHERE id = ?",
      [id],
      callback
    );
  },

  update: (
    id,
    name,
    contact,
    email,
    password = null,
    profile_pic = null,
    callback
  ) => {
    let query = "UPDATE users SET name = ?, contact = ?, email = ?";
    let values = [name, contact, email];

    if (password !== null && password !== undefined) {
      query += ", password = ?";
      values.push(password);
    }

    if (profile_pic !== null && profile_pic !== undefined) {
      query += ", profile_pic = ?";
      values.push(profile_pic);
    }

    query += " WHERE id = ?";
    values.push(id);

    console.log("Executing Query:", query);
    console.log("With Values:", values);

    db.query(query, values, callback);
  },

  updateProfilePic: (userId, profilePicBuffer, callback) => {
    const query = "UPDATE users SET profile_pic = ? WHERE id = ?";
    db.query(query, [profilePicBuffer, userId], (err, results) => {
      if (err) {
        return callback(err); // Returns the error to the callback
      }
      callback(null, results); // Successful database update, return results to callback
    });
  },
};

module.exports = User;
