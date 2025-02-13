import { createContext, useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AlertSnackbar from "../components/AlertSnackbar";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );
  const [role, setRole] = useState("user");
  const [profilePic, setProfilePic] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const navigate = useNavigate();
  let logoutTimer = null;
  const initialLoad = useRef(true); // Track initial page load

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setRole(decodedToken?.role || "user");
          setProfilePic(decodedToken?.profile_pic || null);
          setIsLoggedIn(true);
          resetInactivityTimer();
        } catch (error) {
          console.error("Invalid token:", error);
          showAlert("error", "Invalid session. Please log in again.");
          logout(true);
        }
      } else {
        if (!initialLoad.current) {
          logout(true); // Logout only if not the first page load
        }
      }

      initialLoad.current = false; // Mark initial load as completed
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const login = (token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(jwtDecode(token)));
    const decodedToken = jwtDecode(token);
    setRole(decodedToken?.role || "user");
    setProfilePic(decodedToken?.profile_pic || null);
    setIsLoggedIn(true);
    resetInactivityTimer();
    showAlert("success", "Logged in successfully!");
  };

  const logout = (silent = false) => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole("user");
    setProfilePic(null);
    clearTimeout(logoutTimer);

    if (!silent) {
      showAlert("info", "You have been logged out.");
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      navigate("/login");
      showAlert(
        "warning",
        "Session expired due to inactivity. Please log in again."
      );
      logout();
    }, 60 * 60 * 1000); // 1 hour
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      clearTimeout(logoutTimer);
    };
  }, []);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
  };

  const handleClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, profilePic, setRole, login, logout }}
    >
      <AlertSnackbar
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleClose}
      />
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
