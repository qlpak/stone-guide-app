const express = require("express");
const connectDB = require("./config/database");
const stoneRoutes = require("./routes/stones");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/stones", stoneRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Stone Guide API" });
});

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
