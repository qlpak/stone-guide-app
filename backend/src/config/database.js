const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const getSecret = (name) => {
  const path = `/run/secrets/${name}`;
  return fs.existsSync(path) ? fs.readFileSync(path, "utf-8").trim() : null;
};

const mongoUri = getSecret("mongo_uri") || process.env.MONGO_URI;

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") return;
  try {
    await mongoose.connect(mongoUri, { dbName: "stone-guide-app" });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
