import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import AlertSnackbar from "../components/AlertSnackbar"; // Import AlertSnackbar

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  setAlert,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm(); // Run the confirmation action
      onClose(); // Close dialog after confirmation
    } catch (err) {
      console.error(err);
      // Use the AlertSnackbar to show the error message
      setAlert({
        open: true,
        type: "error",
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#555" }}>
              {message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={onClose}
            color="secondary"
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <AlertSnackbar
        open={false} // This will be controlled by the parent component's alert state
        type="error"
        message="An error occurred. Please try again."
        onClose={() => {}}
      />
    </>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired, // Prop to trigger alert state
};

export default ConfirmationDialog;
