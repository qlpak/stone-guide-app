const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../config/logger");

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("MongoDB connected successfully!"))
  .catch((err) => logger.error("MongoDB connection error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Stone Guide API" });
});

const stoneRoutes = require("./routes/stones");
const pricingRoutes = require("./routes/pricing");

app.use("/api/stones", stoneRoutes);
app.use("/api/pricing", pricingRoutes);

module.exports = app;
