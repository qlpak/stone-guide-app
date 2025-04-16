const express = require("express");
const {
  calculatePriceController,
} = require("../controllers/pricingController");
const checkJwt = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pricing
 *   description: Endpoints for stone pricing calculations
 *
 * /api/pricing:
 *   post:
 *     summary: Calculate stone pricing
 *     description: Accepts dimensions and stone type, returns price based on price list
 *     tags: [Pricing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - width
 *               - height
 *               - type
 *             properties:
 *               width:
 *                 type: number
 *                 example: 100
 *               height:
 *                 type: number
 *                 example: 50
 *               type:
 *                 type: string
 *                 example: Quartzite
 *     responses:
 *       200:
 *         description: Successfully calculated price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 area:
 *                   type: number
 *                   example: 0.5
 *                 price:
 *                   type: number
 *                   example: 1200
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.post("/", checkJwt, calculatePriceController);

module.exports = router;
