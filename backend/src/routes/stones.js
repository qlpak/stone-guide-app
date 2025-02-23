const express = require("express");
const {
  getStones,
  getStoneById,
  createStone,
  searchStones,
  getRecommendedStones,
} = require("../controllers/stoneController");

const router = express.Router();
router.get("/recommendations/:id", getRecommendedStones);
router.get("/search", searchStones);
router.get("/", getStones);
router.get("/:id", getStoneById);
router.post("/", createStone);

module.exports = router;
