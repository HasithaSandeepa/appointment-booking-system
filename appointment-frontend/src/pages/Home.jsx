import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SecurityIcon from "@mui/icons-material/Security";

export default function Home() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(sessionStorage.getItem("user")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const features = [
    {
      title: "Easy Scheduling",
      description: "Book appointments in just a few clicks.",
      icon: <ScheduleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Manage Bookings",
      description: "View your appointments anytime.",
      icon: <EventAvailableIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
    {
      title: "Secure & Reliable",
      description: "Your data is safe with our secure system.",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    },
  ];

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          {getGreeting()} {user?.name}..!
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          Welcome to the Appointment Booking System
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Book and manage your appointments with ease.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to={user ? "/book" : "/login"}
          sx={{ px: 4, py: 1.5, borderRadius: "20px" }}
        >
          Book an Appointment
        </Button>
      </motion.div>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mt: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                sx={{
                  minHeight: 180,
                  boxShadow: 4,
                  borderRadius: 4,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                    transition: "0.3s",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
