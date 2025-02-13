const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const appointmentRoutes = require("./routes/appointmentRoutes");
const slotRoutes = require("./routes/slotRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const path = require("path");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
app.use(bodyParser.json());

app.use("/appointments", appointmentRoutes);
app.use("/slots", slotRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
