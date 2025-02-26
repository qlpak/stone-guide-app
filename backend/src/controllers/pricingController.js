const logger = require("../config/logger");
const { calculatePrice } = require("../services/pricingService");

const calculatePriceController = async (req, res) => {
  try {
    const priceData = await calculatePrice(req.body);
    res.json(priceData);
  } catch (error) {
    logger.error("Error in price calculation:", error);
    const status =
      error.status || (error.message.includes("Database failure") ? 500 : 400);
    const message = status === 500 ? "Internal Server Error" : error.message;
    res.status(status).json({ error: message });
  }
};

module.exports = { calculatePriceController };
