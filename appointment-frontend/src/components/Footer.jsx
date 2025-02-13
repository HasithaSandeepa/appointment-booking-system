import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976d2",
        color: "white",
        textAlign: "center",
        py: 2,
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Container>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Appointment System. Designed and
          developed by{" "}
          <Link
            href="https://www.linkedin.com/in/hasitha-sandeepa"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white", fontWeight: "bold", textDecoration: "none" }}
          >
            Hasitha Sandeepa
          </Link>
          . All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
