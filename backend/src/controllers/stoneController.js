const Stone = require("../models/Stone");

const getStones = async (req, res) => {
  try {
    const {
      type,
      color,
      priceMin,
      priceMax,
      usage,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (color) filter.color = color;
    if (priceMin || priceMax) {
      filter.pricePerM2_2cm = {};
      if (priceMin) filter.pricePerM2_2cm.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricePerM2_2cm.$lte = parseFloat(priceMax);
    }
    if (usage) filter.usage = { $in: usage.split(",") };

    const stones = await Stone.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Stone.countDocuments(filter);

    res.json({
      stones,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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

const searchStones = async (req, res) => {
  try {
    const { query, usage } = req.query;

    if (!query && !usage) {
      return res.status(400).json({ error: "Missing search parameters" });
    }

    const filter = {};
    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    if (usage && typeof usage === "string") {
      filter.usage = { $in: usage.split(",") };
    }

    const stones = await Stone.find(filter);

    if (!stones.length) {
      return res.status(404).json({ error: "No stones found" });
    }

    res.json({ stones });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getRecommendedStones = async (req, res) => {
  try {
    const { id } = req.params;
    const stone = await Stone.findById(id);

    if (!stone) {
      return res.status(404).json({ error: "Stone not found." });
    }

    const recommendedStones = await Stone.find({
      type: stone.type,
      color: stone.color,
      _id: { $ne: stone._id },
    }).limit(5);
    res.json(recommendedStones);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getStones,
  getStoneById,
  createStone,
  searchStones,
  getRecommendedStones,
};
