const mongoose = require("mongoose");

const StoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["marble", "granite", "quartzite", "onyx"],
      required: true,
    },
    color: { type: String, required: true },
    pricePerM2: { type: Number, required: true },
    usage: [
      {
        type: String,
        enum: ["kitchen", "bathroom", "stairs", "wall", "ground"],
        required: true,
      },
    ],
    location: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stone", StoneSchema);
