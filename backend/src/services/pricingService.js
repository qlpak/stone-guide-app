const Stone = require("../models/Stone");
const { convertToM2 } = require("../utils/convertToM2");
const { getExchangeRate } = require("../utils/exchangeRate");
const { validatePriceCalculation } = require("../utils/validation");
const logger = require("../config/logger");

const calculatePrice = async (params) => {
  validatePriceCalculation(params);

  const { stoneId, length, width, unit, thickness, additionalCosts } = params;

  const stone = await Stone.findById(stoneId);
  if (!stone) {
    logger.warn("Stone not found with ID: " + stoneId);
    const error = new Error("Stone not found.");
    error.status = 404;
    throw error;
  }

  const areaM2 = convertToM2(length, width, unit);
  if (!areaM2) {
    logger.warn("Invalid unit provided: " + unit);
    throw new Error("Invalid unit provided.");
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

  return {
    areaM2,
    priceEUR: totalPriceEUR,
    pricePLN: totalPricePLN,
    priceUSD: totalPriceUSD,
  };
};

module.exports = { calculatePrice };
