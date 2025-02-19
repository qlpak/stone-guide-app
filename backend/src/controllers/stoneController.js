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
    const { name, type, color, pricePerM2, usage, location } = req.body;
    const newStone = new Stone({
      name,
      type,
      color,
      pricePerM2,
      usage,
      location,
    });
    await newStone.save();
    res.status(201).json(newStone);
  } catch (error) {
    res.status(400).json({ message: "Error creating stone.;(" });
  }
};

module.exports = { getStones, getStoneById, createStone };
