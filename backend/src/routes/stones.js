const express = require("express");
const {
  getStones,
  getStoneById,
  createStone,
  searchStones,
  getRecommendedStones,
} = require("../controllers/stoneController");

const router = express.Router();
router.get("/search", searchStones);
router.get("/recommendations/:id", getRecommendedStones);
router.get("/:id", getStoneById);
router.get("/", getStones);
router.post("/", createStone);

module.exports = router;
