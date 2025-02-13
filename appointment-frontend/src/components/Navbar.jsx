import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import ConfirmationDialog from "./ConfirmationDialog";

export default function Navbar() {
  const { isLoggedIn, logout, role } = useAuth(); // Get role from context
  const [anchorEl, setAnchorEl] = useState(null); // For the profile menu
  const [drawerOpen, setDrawerOpen] = useState(false); // For the mobile drawer
  const [openDialog, setOpenDialog] = useState(false); // For logout confirmation dialog
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user"))); // State to store user data
  const navigate = useNavigate();

  // Listen for changes to localStorage and update state
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
      setUser(updatedUser); // Update user state
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // This effect runs once when the component mounts

  useEffect(() => {
    // Fetch updated user data from sessionStorage when isLoggedIn changes
    const updatedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(updatedUser);
  }, [isLoggedIn]); // Runs whenever login status changes

  const profilePic = user?.profile_pic || "/default-profile.png";

  // Open the profile menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the profile menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout click
  const handleLogoutClick = () => {
    setOpenDialog(true); // Open the confirmation dialog
    handleMenuClose();
  };

  // Confirm logout action
  const handleLogoutConfirm = () => {
    logout(); // Call global logout function
    setOpenDialog(false); // Close the dialog
    navigate("/login"); // Redirect to login page after logout
  };

  // Cancel logout action
  const handleLogoutCancel = () => {
    setOpenDialog(false); // Close the dialog without logging out
  };

  // Toggle the drawer for mobile
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Mobile Drawer Links
  const mobileLinks = (
    <List>
      {role !== "admin" && (
        <>
          <ListItem
            button
            component={Link}
            to="/"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/book"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Book Appointment" />
          </ListItem>
        </>
      )}

      {isLoggedIn && (
        <>
          <ListItem
            button
            component={Link}
            to="/profile"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Profile" />
          </ListItem>
          {role === "admin" && (
            <ListItem
              button
              component={Link}
              to="/admin"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Admin Panel" />
            </ListItem>
          )}
          <Divider />
          <ListItem button onClick={handleLogoutClick}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      )}

      {!isLoggedIn && (
        <>
          <ListItem
            button
            component={Link}
            to="/login"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/register"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Register" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ mb: "2%" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          Appointment System
        </Typography>

        {role !== "admin" && (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                display: { xs: "none", md: "block" },
                "&:hover": {
                  backgroundColor: "white", // Change background color on hover
                  color: "black", // Change text color on hover
                },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/book"
              sx={{
                display: { xs: "none", md: "block" },
                "&:hover": {
                  backgroundColor: "white", // Change background color on hover
                  color: "black", // Change text color on hover
                },
              }}
            >
              Book Appointment
            </Button>
          </>
        )}

        <div style={{ flexGrow: 1 }}></div>
        <IconButton
          color="inherit"
          edge="end"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {isLoggedIn ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                display: { xs: "none", md: "block" },
                padding: 1.5,
              }}
            >
              {profilePic ? (
                <Avatar src={profilePic} sx={{ width: 40, height: 40 }} />
              ) : (
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleMenuClose}
              >
                Profile
              </MenuItem>
              {role === "user" && (
                <MenuItem
                  component={Link}
                  to="/appointments"
                  onClick={handleMenuClose}
                >
                  My Appointments
                </MenuItem>
              )}
              {role === "admin" && (
                <MenuItem
                  component={Link}
                  to="/admin"
                  onClick={handleMenuClose}
                >
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/register"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {mobileLinks}
      </Drawer>

      <ConfirmationDialog
        open={openDialog}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </AppBar>
  );
}
