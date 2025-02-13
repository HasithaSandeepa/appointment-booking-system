import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertSnackbar from "../components/AlertSnackbar";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      showAlert("error", "You must log in first.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:3000/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error(error);
        showAlert("error", "Failed to fetch appointments. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handleCancel = () => {
    if (!selectedAppointment) return;

    const token = sessionStorage.getItem("token");

    if (!token) {
      showAlert("error", "You must log in first.");
      navigate("/login");
      return;
    }

    axios
      .delete(`http://localhost:3000/appointments/${selectedAppointment.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.id !== selectedAppointment.id
          )
        );
        showAlert("success", "Appointment canceled successfully!");
        handleCloseDialog();
      })
      .catch((error) => {
        console.error(error);
        showAlert(
          "error",
          error.response?.data?.message || "Failed to cancel appointment."
        );
      });
  };

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          textAlign="center"
        >
          My Appointments
        </Typography>

        <AlertSnackbar
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={handleClose}
        />

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <ListItem
                  key={appointment.id}
                  sx={{
                    borderBottom: "1px solid #ddd",
                    paddingY: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight={500}>
                        {appointment.name} - {appointment.contact}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {new Date(appointment.date).toLocaleDateString()} -{" "}
                        {appointment.time}
                      </Typography>
                    }
                  />
                  <Button
                    onClick={() => handleOpenDialog(appointment)}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: "8px", paddingX: 2 }}
                  >
                    Cancel
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 2, color: "gray" }}
              >
                No appointments found.
              </Typography>
            )}
          </List>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onConfirm={handleCancel}
          title="Cancel Appointment"
          message="Are you sure you want to cancel this appointment?"
        />
      </Paper>
    </Container>
  );
}
