const logger = require("../config/logger");
const {
  getStonesService,
  getStoneByIdService,
  createStoneService,
  searchStonesService,
  getRecommendedStonesService,
} = require("../services/stoneService");

const getStones = async (req, res) => {
  try {
    const result = await getStonesService(req.query);
    logger.info("Fetched stones list", { query: req.query });
    res.json(result);
  } catch (error) {
    logger.error("Error fetching stones", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStoneById = async (req, res) => {
  try {
    const stone = await getStoneByIdService(req.params.id);
    if (!stone) {
      logger.warn("Stone not found", { id: req.params.id });
      return res.status(404).json({ message: "Stone not found" });
    }
    res.status(200).json(stone);
  } catch (error) {
    logger.error("Error fetching stone by ID", { error });
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
      logger.warn("Missing required fields", { body: req.body });
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (!pricePerM2_2cm && !pricePerM2_3cm) {
      logger.warn("At least one price is required", { body: req.body });
      return res
        .status(400)
        .json({ error: "At least one price (2cm or 3cm) is required." });
    }

    const stone = await createStoneService(req.body);
    logger.info("New stone created", { stone });
    res.status(201).json(stone);
  } catch (error) {
    logger.error("Error creating stone", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchStones = async (req, res) => {
  try {
    const { query, usage } = req.query;
    if (!query && !usage) {
      logger.warn("Missing search parameters", { query: req.query });
      return res.status(400).json({ error: "Missing search parameters" });
    }

    const stones = await searchStonesService(query, usage);
    if (!stones.length) {
      logger.warn("No stones found for search query", { query: req.query });
      return res.status(404).json({ error: "No stones found" });
    }
    logger.info("Stone search successful", {
      query: req.query,
      results: stones.length,
    });
    res.json({ stones });
  } catch (error) {
    logger.error("Error searching stones", { error });
    res.status(500).json({ error: error.message });
  }
};

const getRecommendedStones = async (req, res) => {
  try {
    const recommendedStones = await getRecommendedStonesService(req.params.id);
    if (!recommendedStones) {
      logger.warn("Stone not found for recommendations", { id: req.params.id });
      return res.status(404).json({ error: "Stone not found." });
    }
    logger.info("Recommended stones retrieved", {
      id: req.params.id,
      recommendations: recommendedStones.length,
    });
    res.json(recommendedStones);
  } catch (error) {
    logger.error("Error fetching recommended stones", { error });
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
