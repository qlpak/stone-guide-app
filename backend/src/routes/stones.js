const express = require("express");
const {
  getStones,
  getStoneById,
  createStone,
  searchStones,
  getRecommendedStones,
  filterRecommendations,
  compareStones,
} = require("../controllers/stoneController");
const checkJwt = require("../middlewares/auth");
const authorizeRole = require("../middlewares/authorizeRole");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stones
 *   description: Endpoints related to stone data
 */

/**
 * @swagger
 * /api/stones:
 *   get:
 *     summary: Get all stones
 *     description: Returns a list of all stones in the database
 *     tags: [Stones]
 *     responses:
 *       200:
 *         description: List of stones
 */
router.get("/", getStones);

/**
 * @swagger
 * /api/stones/search:
 *   get:
 *     summary: Search for stones
 *     description: Returns a list of stones matching search criteria
 *     tags: [Stones]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Search query (name)
 *       - in: query
 *         name: usage
 *         schema:
 *           type: string
 *         required: false
 *         description: Usage filter (comma-separated)
 *     responses:
 *       200:
 *         description: List of matching stones
 */
router.get("/search", searchStones);

/**
 * @swagger
 * /api/stones/recommend:
 *   get:
 *     summary: Filter stone recommendations
 *     description: Returns filtered recommendations based on query. Requires JWT.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filtered stones
 *       401:
 *         description: Unauthorized
 */
router.get("/recommend", checkJwt, filterRecommendations);

/**
 * @swagger
 * /api/stones/recommendations/{id}:
 *   get:
 *     summary: Get recommended stones
 *     description: Returns a list of recommended stones based on the given stone ID
 *     tags: [Stones]
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
 *     description: Returns details of a stone by ID
 *     tags: [Stones]
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
 *       404:
 *         description: Stone not found
 */
router.get("/:id", getStoneById);

/**
 * @swagger
 * /api/stones/add-stone:
 *   post:
 *     summary: Create a new stone (admin only)
 *     description: Adds a new stone to the database. Requires admin role.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - color
 *               - usage
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               color:
 *                 type: string
 *               pricePerM2_2cm:
 *                 type: number
 *               pricePerM2_3cm:
 *                 type: number
 *               usage:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Stone successfully created
 *       400:
 *         description: Missing or invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.post("/", checkJwt, authorizeRole("admin"), createStone);

/**
 * @swagger
 * /api/stones/compare:
 *   post:
 *     summary: Compare stones
 *     description: Compares multiple stones. Requires authentication.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stoneIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Comparison result
 *       401:
 *         description: Unauthorized
 */
router.post("/compare", checkJwt, compareStones);

module.exports = router;
