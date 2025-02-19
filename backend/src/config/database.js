const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") return;
  try {
    await mongoose.connect(mongoUri, { dbName: "testdb" });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
