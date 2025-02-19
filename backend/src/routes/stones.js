const express = require("express");
const router = express.Router();
const {
  getStones,
  getStoneById,
  createStone,
} = require("../controllers/stoneController");

router.get("/", getStones);
router.get("/:id", getStoneById);
router.post("/", createStone);

module.exports = router;
