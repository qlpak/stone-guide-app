const axios = require("axios");
const Stone = require("../models/Stone");

const convertToM2 = (length, width, unit) => {
  switch (unit) {
    case "cm":
      return (length / 100) * (width / 100);
    case "m":
      return length * width;
    default:
      throw new Error("Invalid unit provided.");
  }
};

const getExchangeRate = async () => {
  try {
    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
    );
    return response.data.eur.pln;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

const calculatePrice = async (req, res) => {
  try {
    const { stoneId, length, width, unit } = req.body;

    if (!stoneId || !length || !width || !unit) {
      return res.status(400).json({
        error: "All fields are required: stoneId, length, width, unit.",
      });
    }

    const stone = await Stone.findById(stoneId);
    if (!stone) {
      return res.status(404).json({ error: "Stone not found." });
    }

    const areaM2 = convertToM2(length, width, unit);
    const priceEUR = areaM2 * stone.pricePerM2;
    const exchangeRate = await getExchangeRate();

    if (!exchangeRate) {
      return res.status(500).json({ error: "Failed to fetch exchange rate." });
    }

    const pricePLN = priceEUR * exchangeRate;

    res.json({
      stone: stone.name,
      areaM2,
      priceEUR: priceEUR.toFixed(2),
      pricePLN: pricePLN.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { calculatePrice };
