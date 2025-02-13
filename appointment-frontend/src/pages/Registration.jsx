import { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertSnackbar from "../components/AlertSnackbar"; // Import Snackbar component

export default function Registration() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{}|;:,.<>?/~`]{8,}$/;
    setPasswordValid(passwordRegex.test(pass));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateContact = (contact) => /^\d{10}$/.test(contact);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim() || !email.trim() || !password.trim()) {
      showAlert("error", "All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("error", "Please enter a valid email address.");
      return;
    }

    if (!validateContact(contact)) {
      showAlert("error", "Contact number must be 10 digits.");
      return;
    }

    if (!passwordValid) {
      showAlert("error", "Password does not meet the criteria.");
      return;
    }

    if (!passwordMatch) {
      showAlert("error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/users/register", {
        name,
        contact,
        email,
        password,
      });

      showAlert("success", "Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (error.response) {
        showAlert(
          "error",
          error.response.data.message || "Registration failed."
        );
      } else {
        showAlert("error", "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 6, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={600}
          textAlign="center"
        >
          Create an Account
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Fill in the details below to register.
        </Typography>

        <AlertSnackbar
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                margin="normal"
                variant="outlined"
                error={contact && !validateContact(contact)}
                helperText={
                  contact && !validateContact(contact)
                    ? "Enter a valid 10-digit number."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                error={email && !validateEmail(email)}
                helperText={
                  email && !validateEmail(email)
                    ? "Enter a valid email address."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                margin="normal"
                variant="outlined"
                error={!passwordValid}
                helperText={
                  !passwordValid
                    ? "At least 8 chars, 1 digit, 1 uppercase letter."
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                margin="normal"
                variant="outlined"
                error={!passwordMatch}
                helperText={!passwordMatch ? "Passwords do not match." : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    paddingY: 1,
                    fontSize: "1rem",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#0056b3" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Already have an account? */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                cursor: "pointer",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

Registration.propTypes = {
  onLogin: PropTypes.func,
};
