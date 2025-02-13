const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory (Buffer)
const upload = multer({ storage });

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", authenticateToken, userController.getUserProfile);
router.put("/profile", authenticateToken, userController.updateUserProfile);

// New route for profile picture update
router.put(
  "/profile/picture",
  authenticateToken,
  upload.single("profile_pic"),
  userController.uploadProfilePic
);

module.exports = router;
