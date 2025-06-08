const mongoose = require("mongoose");

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "stoneguide",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
