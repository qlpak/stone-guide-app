const express = require("express");
const {
  calculatePriceController,
} = require("../controllers/pricingController");

const router = express.Router();

/**
 * @swagger
 * /api/pricing:
 *   post:
 *     summary: Calculate stone pricing
 *     description: Accepts dimensions in cm or m and returns the price based on the price list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               width:
 *                 type: number
 *                 example: 100
 *               height:
 *                 type: number
 *                 example: 50
 *               type:
 *                 type: string
 *                 example: "Quartzite"
 *     responses:
 *       200:
 *         description: Returns calculated price
 */
router.post("/", calculatePriceController);

module.exports = router;
