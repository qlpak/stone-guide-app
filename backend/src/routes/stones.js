const express = require("express");
const {
  getStones,
  getStoneById,
  createStone,
  searchStones,
  getRecommendedStones,
} = require("../controllers/stoneController");
const checkJwt = require("../middlewares/auth");
const authorizeRole = require("../middlewares/authorizeRole");

/**
 * @swagger
 * tags:
 *   name: Stones
 *   description: Endpoints related to stone data
 */
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

// /**
//  * @swagger
//  * /api/stones:
//  *   post:
//  *     summary: Add a new stone
//  *     description: Creates a new stone entry in the database
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Taj Mahal Quartzite"
//  *               type:
//  *                 type: string
//  *                 example: "Quartzite"
//  *               price_per_m2:
//  *                 type: number
//  *                 example: 150
//  *     responses:
//  *       201:
//  *         description: Stone successfully added
//  */
router.post("/", createStone);

/**
 * @swagger
 * /api/stones:
 *   get:
 *     summary: Get all stones
 *     description: Returns a list of all stones in the database. Requires authentication.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stones
 *       401:
 *         description: Unauthorized
 */
router.get("/", checkJwt, getStones);

/**
 * @swagger
 * /api/stones/{id}:
 *   get:
 *     summary: Get stone details
 *     description: Returns details of a stone by ID. Requires authentication.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stone ID
 *     responses:
 *       200:
 *         description: Stone found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Stone not found
 */
router.get("/:id", checkJwt, getStoneById);

/**
 * @swagger
 * /api/stones/search:
 *   get:
 *     summary: Search stones
 *     description: Search for stones matching query parameters. Requires authentication.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Matching stones
 *       401:
 *         description: Unauthorized
 */
router.get("/search", checkJwt, searchStones);

/**
 * @swagger
 * /api/stones/recommendations/{id}:
 *   get:
 *     summary: Get stone recommendations
 *     description: Returns stones similar to the specified one. Requires authentication.
 *     tags: [Stones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the base stone
 *     responses:
 *       200:
 *         description: Recommended stones
 *       401:
 *         description: Unauthorized
 */
router.get("/recommendations/:id", checkJwt, getRecommendedStones);

/**
 * @swagger
 * /api/stones:
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
 *               - pricePerM2_2cm
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Taj Mahal Quartzite"
 *               type:
 *                 type: string
 *                 example: "Quartzite"
 *               color:
 *                 type: string
 *                 example: "White-Gold"
 *               pricePerM2_2cm:
 *                 type: number
 *                 example: 150
 *               usage:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["kitchen", "bathroom"]
 *               location:
 *                 type: string
 *                 example: "Showroom A, Shelf 3"
 *     responses:
 *       201:
 *         description: Stone successfully created
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (no token)
 *       403:
 *         description: Forbidden (user lacks admin role)
 */
router.post("/", checkJwt, authorizeRole("admin"), createStone);

module.exports = router;
