const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");

dotenv.config();

// 🔥 CONNECT DATABASE
connectDB();

const app = express();

// JSON middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobApplications", jobApplicationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
