import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertSnackbar from "../components/AlertSnackbar"; // Import AlertSnackbar component

export default function Login() {
  const { login, setRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showAlert("error", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token);
      setRole(user.role);
      sessionStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));

      showAlert("success", "Login successful!");
      setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/"), 1500);
    } catch (error) {
      if (error.response) {
        showAlert(
          "error",
          error.response.data.message || "Invalid credentials."
        );
      } else if (error.request) {
        showAlert("error", "Network error. Please try again.");
      } else {
        showAlert("error", "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          marginTop: 8,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Login
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Please enter your credentials to continue.
        </Typography>

        <AlertSnackbar
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Box sx={{ mt: 3 }}>
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
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </form>
        {/* Already have an account? */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              underline="hover"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                cursor: "pointer",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
