import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

export default function AlertSnackbar({ open, type, message, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "Bottom", horizontal: "right" }}
      sx={{ width: "50%", mb: "2%" }}
    >
      <Alert
        severity={type}
        onClose={onClose}
        variant="filled"
        sx={{ width: "50%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

AlertSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
