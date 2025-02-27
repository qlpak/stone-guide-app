const express = require("express");
const {
  getStones,
  getStoneById,
  createStone,
  searchStones,
  getRecommendedStones,
} = require("../controllers/stoneController");

const router = express.Router();

/**
 * @swagger
 * /api/stones/search:
 *   get:
 *     summary: Search for stones
 *     description: Returns a list of stones matching search criteria
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching stones
 */
router.get("/search", searchStones);

/**
 * @swagger
 * /api/stones/recommendations/{id}:
 *   get:
 *     summary: Get recommended stones
 *     description: Returns a list of recommended stones based on the given stone ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stone ID
 *     responses:
 *       200:
 *         description: List of recommended stones
 */
router.get("/recommendations/:id", getRecommendedStones);

/**
 * @swagger
 * /api/stones/{id}:
 *   get:
 *     summary: Get stone details
 *     description: Returns details of a stone based on its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stone ID
 *     responses:
 *       200:
 *         description: Stone details
 */
router.get("/:id", getStoneById);

/**
 * @swagger
 * /api/stones:
 *   get:
 *     summary: Get all stones
 *     description: Returns a list of all stones in the database
 *     responses:
 *       200:
 *         description: List of stones
 */
router.get("/", getStones);

/**
 * @swagger
 * /api/stones:
 *   post:
 *     summary: Add a new stone
 *     description: Creates a new stone entry in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Taj Mahal Quartzite"
 *               type:
 *                 type: string
 *                 example: "Quartzite"
 *               price_per_m2:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Stone successfully added
 */
router.post("/", createStone);

module.exports = router;
