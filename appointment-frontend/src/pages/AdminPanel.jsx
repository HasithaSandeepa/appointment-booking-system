import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default calendar styles
import ConfirmationDialog from "../components/ConfirmationDialog";
import AlertSnackbar from "../components/AlertSnackbar";

export default function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [highlightedDates, setHighlightedDates] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must log in first.");
      return;
    }

    axios
      .get("http://localhost:3000/appointments/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAppointments(response.data);

        const bookedDates = new Set(
          response.data.map((appointment) => appointment.date)
        );
        setHighlightedDates(bookedDates);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setAlert({
          open: true,
          type: "error",
          message: "Failed to load appointments.",
        });
      });
  }, []);

  const handleAddSlot = () => {
    const token = sessionStorage.getItem("token");

    axios
      .post(
        "http://localhost:3000/slots",
        { date, time },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setAlert({
          open: true,
          type: "success",
          message: "Slot added successfully!",
        });
        setDate("");
        setTime("");
      })
      .catch((error) => {
        console.error("Error adding slot:", error);
        setAlert({ open: true, type: "error", message: "Failed to add slot." });
      });
  };

  const handleDeleteAppointment = (id) => {
    setSelectedAppointmentId(id);
    setDialogOpen(true); // Show confirmation dialog
  };

  const confirmDeleteAppointment = () => {
    const token = sessionStorage.getItem("token");

    axios
      .delete(`http://localhost:3000/appointments/${selectedAppointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.id !== selectedAppointmentId
          )
        );

        const deletedAppointment = appointments.find(
          (appointment) => appointment.id === selectedAppointmentId
        );
        if (deletedAppointment) {
          const updatedHighlightedDates = new Set(highlightedDates);
          updatedHighlightedDates.delete(deletedAppointment.date);
          setHighlightedDates(updatedHighlightedDates);
        }

        setAlert({
          open: true,
          type: "success",
          message: "Appointment deleted successfully!",
        });
        setDialogOpen(false); // Close dialog after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
        setAlert({
          open: true,
          type: "error",
          message: "Failed to delete appointment.",
        });
        setDialogOpen(false); // Close dialog after error
      });
  };

  const filteredAppointments = selectedDate
    ? appointments.filter((appointment) => appointment.date === selectedDate)
    : [];

  const tileClassName = ({ date }) => {
    const dateString = date.toISOString().split("T")[0];
    return highlightedDates.has(dateString) ? "highlighted-date" : null;
  };

  const tileContent = ({ date }) => {
    const dateString = date.toISOString().split("T")[0];
    if (highlightedDates.has(dateString)) {
      return <div className="highlighted-dot"></div>;
    }
    return null;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {/* Add Slot Section */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Slot
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Button
            onClick={handleAddSlot}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Add Slot
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ marginBottom: 2 }} />

      {/* Calendar Section */}
      <Typography variant="h6" gutterBottom>
        Appointments Calendar
      </Typography>
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Calendar
            tileClassName={tileClassName}
            tileContent={tileContent}
            onClickDay={(date) =>
              setSelectedDate(date.toISOString().split("T")[0])
            }
          />
        </CardContent>
      </Card>

      {/* Booking Details for Selected Date */}
      {selectedDate && (
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Booking Details for {selectedDate}
            </Typography>

            {filteredAppointments.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No Appointments
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredAppointments.map((appointment) => (
                  <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                    <Card sx={{ width: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {appointment.name} - {appointment.contact}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Appointment Date: {appointment.date}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Time: {appointment.time}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteAppointment(appointment.id)
                          }
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}

      {/* Appointments List Section */}
      <Typography variant="h6" gutterBottom>
        All Appointments
      </Typography>
      {appointments.length === 0 ? (
        <Typography sx={{ mb: "10%" }} variant="body2" color="textSecondary">
          No Appointments
        </Typography>
      ) : (
        <Grid sx={{ mb: "10%" }} container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} sm={6} md={4} key={appointment.id}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {appointment.name} - {appointment.contact}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Appointment Date: {appointment.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {appointment.time}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Custom CSS for highlighted dates */}
      <style>
        {`
          .highlighted-date {
            background-color: #ff6b6b; 
            color: white;
            border-radius: 50%;
          }
          .highlighted-dot {
            height: 8px;
            width: 8px;
            background-color: white;
            border-radius: 50%;
            margin: 2px auto;
          }
        `}
      </style>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDeleteAppointment}
        title="Confirm Deletion"
        message="Are you sure you want to delete this appointment?"
        setAlert={setAlert}
      />

      {/* Alert Snackbar */}
      <AlertSnackbar
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ open: false, type: "", message: "" })}
      />
    </Container>
  );
}
