const axios = require("axios");
const Stone = require("../models/Stone");
const logger = require("../config/logger");
const redis = require("../config/redis");

const convertToM2 = (length, width, unit) => {
  if (unit === "cm") {
    return (length / 100) * (width / 100);
  } else if (unit === "cm2") {
    return length / 10000;
  } else if (unit === "m") {
    return length * width;
  } else if (unit === "m2") {
    return length;
  }
  return null;
};

const EXPIRATION_TIME = 86400; // 24h in seconds

const getExchangeRate = async () => {
  try {
    const cachedRates = await redis.get("exchange_rates");
    if (cachedRates) {
      logger.info("Exchange rates retrieved from cache");
      return JSON.parse(cachedRates);
    }

    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
    );
    const eurRate = response.data.eur.pln;
    const usdRate = response.data.eur.usd;

    await redis.set(
      "exchange_rates",
      JSON.stringify({ eurRate, usdRate }),
      "EX",
      EXPIRATION_TIME
    );

    logger.info("Exchange rates retrieved from API");
    return { eurRate, usdRate };
  } catch (error) {
    logger.error("Error fetching exchange rates:", error);
    return { eurRate: 4.5, usdRate: 1.08 };
  }
};

const calculatePrice = async (req, res) => {
  try {
    const { stoneId, length, width, unit, thickness, additionalCosts } =
      req.body;
    if (!stoneId || !length || !width || !unit || !thickness) {
      logger.warn("Missing required fields in price calculation request.");
      return res.status(400).json({
        error:
          "All fields are required: stoneId, length, width, unit, thickness.",
      });
    }

    if (!["2cm", "3cm"].includes(thickness)) {
      logger.warn("Invalid thickness value received: " + thickness);
      return res
        .status(400)
        .json({ error: "Thickness must be either '2cm' or '3cm'." });
    }

    const stone = await Stone.findById(stoneId);
    if (!stone) {
      logger.warn("Stone not found with ID: " + stoneId);
      return res.status(404).json({ error: "Stone not found." });
    }

    const areaM2 = convertToM2(length, width, unit);
    if (!areaM2) {
      logger.warn("Invalid unit provided: " + unit);
      return res.status(400).json({ error: "Invalid unit provided." });
    }
    const pricePerM2 =
      thickness === "2cm" ? stone.pricePerM2_2cm : stone.pricePerM2_3cm;

    const { eurRate, usdRate } = await getExchangeRate();

    const extraCost =
      additionalCosts && !isNaN(additionalCosts) ? Number(additionalCosts) : 0;

    let totalPriceEUR = Number((areaM2 * pricePerM2 + extraCost).toFixed(2));
    let totalPricePLN = Number((totalPriceEUR * eurRate).toFixed(2));
    let totalPriceUSD = Number((totalPriceEUR * usdRate).toFixed(2));

    logger.info("Price calculation successful for stone ID: " + stoneId);

    res.json({
      areaM2,
      priceEUR: totalPriceEUR,
      pricePLN: totalPricePLN,
      priceUSD: totalPriceUSD,
    });
  } catch (error) {
    logger.error("Error in price calculation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { calculatePrice };
