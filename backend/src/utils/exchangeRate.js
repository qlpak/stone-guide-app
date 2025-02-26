const axios = require("axios");
const redis = require("../config/redis");
const logger = require("../config/logger");

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

module.exports = { getExchangeRate };
