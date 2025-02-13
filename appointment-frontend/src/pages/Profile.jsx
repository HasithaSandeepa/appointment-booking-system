import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";
import AlertSnackbar from "../components/AlertSnackbar"; // Import the AlertSnackbar component

export default function Profile() {
  const token = sessionStorage.getItem("token");
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    profile_pic: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Fetch user details on component mount
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:3000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        sessionStorage.setItem("user", JSON.stringify(response.data));
      })
      .catch((error) =>
        setAlert({
          open: true,
          message: error.response?.data?.message || "Error fetching profile",
          severity: "error",
        })
      );
  }, [token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setUser((prev) => ({ ...prev, profile_pic: base64Image }));
        setNewProfilePic(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile picture
  const updateProfilePicture = () => {
    if (!newProfilePic) return;

    const formData = new FormData();
    formData.append("profile_pic", newProfilePic);

    setLoading(true);
    axios
      .put("http://localhost:3000/users/profile/picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUser((prev) => ({
          ...prev,
          profile_pic: response.data.profilePic,
        }));
        setAlert({
          open: true,
          message: "Profile picture updated successfully!",
          severity: "success",
        });
        setNewProfilePic(null);
      })
      .catch((error) =>
        setAlert({
          open: true,
          message:
            error.response?.data?.message || "Error uploading profile picture",
          severity: "error",
        })
      )
      .finally(() => setLoading(false));
  };

  // Handle profile update
  const handleUpdate = () => {
    if (user.password && user.password !== user.confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }

    // Form validation for email and contact
    if (!user.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setAlert({
        open: true,
        message: "Please enter a valid email address.",
        severity: "error",
      });
      return;
    }
    if (!user.contact.match(/^\d{10}$/)) {
      setAlert({
        open: true,
        message: "Please enter a valid 10-digit contact number.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    const dataToUpdate = {
      name: user.name,
      email: user.email,
      contact: user.contact,
      password: user.password,
    };

    axios
      .put("http://localhost:3000/users/profile", dataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setAlert({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        setEditMode(false);
      })
      .catch((error) =>
        setAlert({
          open: true,
          message: error.response?.data?.message || "Error updating profile",
          severity: "error",
        })
      )
      .finally(() => setLoading(false));
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      {/* Profile Paper Container */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {/* Profile Picture */}
        <IconButton component="label" sx={{ mb: 2 }}>
          <Avatar
            src={user.profile_pic || "/default-profile.png"}
            sx={{ width: 100, height: 100 }}
          />
          {editMode && (
            <>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfilePicChange}
              />
              <AddAPhotoIcon
                sx={{ position: "absolute", bottom: 0, right: 0 }}
              />
            </>
          )}
        </IconButton>

        {/* Update Profile Picture Button */}
        {newProfilePic && (
          <Button
            variant="contained"
            color="primary"
            onClick={updateProfilePicture}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Update Profile Picture"
            )}
          </Button>
        )}

        <TextField
          label="Role"
          name="role"
          value={user.role ? user.role.toUpperCase() : ""}
          fullWidth
          margin="normal"
          disabled
        />

        {/* User Details */}
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!editMode}
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!editMode}
        />
        <TextField
          label="Contact Number"
          name="contact"
          value={user.contact}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!editMode}
        />

        {/* Password Fields */}
        {editMode && (
          <>
            <TextField
              label="New Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={user.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </>
        )}

        {/* Edit/Save Buttons */}
        {editMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(true)}
            sx={{ mt: 2 }}
          >
            Edit Profile
          </Button>
        )}
      </Paper>

      {/* AlertSnackbar for Alerts */}
      <AlertSnackbar
        open={alert.open}
        type={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Container>
  );
}
