require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/api/auth");
const questionRoutes = require("./routes/api/questionRoutes");
const answerRoutes = require("./routes/api/answerRoutes");
const profileRoutes = require("./routes/api/profileRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("DevStack Backend is Running!");
});

module.exports = app;