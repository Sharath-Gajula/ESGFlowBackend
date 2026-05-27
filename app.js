const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/uploadRoutes");
const recordRoutes = require("./routes/recordRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const errorMiddleware = require(
  "./middlewares/errorMiddleware"
);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);

app.use("/api/records", recordRoutes);

app.use("/api/review", reviewRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ESG Backend Running",
  });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;