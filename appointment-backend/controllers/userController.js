const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

//Convert Buffer to Base64
function bufferToBase64(buffer, mimeType = "image/png") {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//Use Memory Storage for images
const storage = multer.memoryStorage(); // Store files in memory (Buffer)
const upload = multer({ storage });

//Assigns default profile picture
exports.register = async (req, res) => {
  const { name, contact, email, password } = req.body;

  if (!name || !contact || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    User.findByEmail(email, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Read default profile picture (BLOB) from file system
      const defaultProfilePicPath = path.join(
        __dirname,
        "..",
        "assets",
        "images",
        "default-profile.jpg"
      );
      fs.readFile(defaultProfilePicPath, (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error reading default profile picture." });
        }

        // Store default image as BLOB in the database
        User.create(
          name,
          contact,
          email,
          hashedPassword,
          "user",
          data,
          (err, result) => {
            if (err) return res.status(500).json({ error: "Database error." });
            res.status(201).json({ message: "User registered successfully!" });
          }
        );
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error." });
  }
};

//User Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error." });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        contact: user.contact,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic ? bufferToBase64(user.profile_pic) : null,
      },
    });
  });
};

//Get User Profile
exports.getUserProfile = (req, res) => {
  const userId = req.user.id;

  User.findById(userId, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error." });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];

    res.json({
      id: user.id,
      name: user.name,
      contact: user.contact,
      email: user.email,
      role: user.role,
      profile_pic: user.profile_pic
        ? `data:image/png;base64,${user.profile_pic.toString("base64")}`
        : null, // Convert BLOB to Base64
    });
  });
};

//Upload Profile Picture (Stores BLOB in DB)
exports.uploadProfilePic = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save the file to the 'uploads/' directory
  const uploadPath = path.join(uploadDir, `${userId}-${Date.now()}.jpg`);

  fs.writeFile(uploadPath, req.file.buffer, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Error saving profile picture." });
    }

    // Call the model to update the profile picture in the database
    User.updateProfilePic(userId, req.file.buffer, (err, results) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ error: "Database error." });
      }

      res.json({ message: "Profile picture uploaded successfully!" });
    });
  });
};

//Update User Profile
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, contact, email, password } = req.body;

  if (!name || !contact || !email) {
    return res
      .status(400)
      .json({ message: "All fields except password are required." });
  }

  try {
    let updateData = {
      name,
      contact,
      email,
      password: password ? await bcrypt.hash(password, 10) : null,
    };

    User.update(
      userId,
      updateData.name,
      updateData.contact,
      updateData.email,
      updateData.password,
      null, // Do not update profile_pic
      (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User profile updated successfully!" });
      }
    );
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error." });
  }
};
