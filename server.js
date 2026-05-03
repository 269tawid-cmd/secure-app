const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

require("dotenv").config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/", authRoutes);
app.use("/", studentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
