import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertSnackbar from "../components/AlertSnackbar";

export default function BookAppointment() {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    slotId: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);

      // Fetch user data
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/users/profile",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFormData((prevData) => ({
            ...prevData,
            name: response.data.name,
            contact: response.data.contact,
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }

    // Fetch available slots
    const fetchSlots = async () => {
      try {
        const response = await axios.get("http://localhost:3000/slots", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedSlots = response.data.map((slot) => {
          const date = new Date(slot.date);
          return {
            ...slot,
            formattedDate: `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
          };
        });

        setSlots(formattedSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, contact, slotId } = formData;
    const token = sessionStorage.getItem("token");

    if (!isLoggedIn || !token) {
      showAlert("error", "You must log in first.");
      navigate("/login");
      return;
    }

    if (!slotId) {
      showAlert("error", "Please select a time slot.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/appointments",
        { name, contact, slotId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the slots state to remove the booked slot
      setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));

      showAlert("success", "Appointment booked successfully!");

      setFormData((prevData) => ({
        ...prevData,
        slotId: "",
      }));
    } catch (error) {
      showAlert("error", "Failed to book appointment.");
      console.error("Error booking appointment:", error);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
        Book an Appointment
      </Typography>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 2 }}>
        <AlertSnackbar
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                disabled
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#f5f5f5" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact"
                value={formData.contact}
                disabled
                variant="outlined"
                InputProps={{
                  sx: { backgroundColor: "#f5f5f5" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Slot"
                value={formData.slotId}
                onChange={(e) =>
                  setFormData({ ...formData, slotId: e.target.value })
                }
                variant="outlined"
              >
                {loading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ marginRight: 1 }} />
                    Loading slots...
                  </MenuItem>
                ) : slots.length > 0 ? (
                  slots.map((slot) => (
                    <MenuItem key={slot.id} value={slot.id}>
                      {slot.formattedDate} - {slot.time}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No available slots</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  paddingX: 4,
                  paddingY: 1,
                  fontSize: "1rem",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#0056b3",
                  },
                }}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
