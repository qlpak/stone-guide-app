const express = require("express");
const connectDB = require("./config/database");
const stoneRoutes = require("./routes/stones");

const app = express();
app.use(express.json());
app.use("/api/stones", stoneRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
