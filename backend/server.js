const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // ✅ to serve frontend files
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files (optional)
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/api/auth", require("./routes/auth"));           // Auth routes
app.use("/api/dashboard", require("./routes/dashboard")); // Dashboard routes (protected)

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html")); // Serve index.html
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
