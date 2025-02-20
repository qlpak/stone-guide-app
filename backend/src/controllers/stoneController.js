const Stone = require("../models/Stone");

const getStones = async (req, res) => {
  try {
    const stones = await Stone.find();
    res.status(200).json(stones);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getStoneById = async (req, res) => {
  try {
    const stone = await Stone.findById(req.params.id);
    if (!stone) return res.status(404).json({ message: "Stone not found" });
    res.status(200).json(stone);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createStone = async (req, res) => {
  try {
    const {
      name,
      type,
      color,
      pricePerM2_2cm,
      pricePerM2_3cm,
      usage,
      location,
    } = req.body;

    if (!name || !type || !color || !usage || !location) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!pricePerM2_2cm && !pricePerM2_3cm) {
      return res
        .status(400)
        .json({ error: "At least one price (2cm or 3cm) is required." });
    }

    const stone = await Stone.create({
      name,
      type,
      color,
      pricePerM2_2cm,
      pricePerM2_3cm,
      usage,
      location,
    });

    res.status(201).json(stone);
  } catch (error) {
    console.error("Error creating stone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStones, getStoneById, createStone };
