const mongoose = require("mongoose");
const logger = require("../config/logger");

const validatePriceCalculation = ({
  stoneId,
  length,
  width,
  unit,
  thickness,
  additionalCosts,
}) => {
  if (!stoneId || !length || !width || !unit || !thickness) {
    throw new Error(
      "All fields are required: stoneId, length, width, unit, thickness."
    );
  }

  if (!["2cm", "3cm"].includes(thickness)) {
    logger.warn("Invalid thickness value received: " + thickness);
    throw new Error("Thickness must be either '2cm' or '3cm'.");
  }

  if (length <= 0 || width <= 0) {
    throw new Error("Invalid dimensions provided.");
  }

  if (!mongoose.Types.ObjectId.isValid(stoneId)) {
    throw new Error("Invalid stone ID format.");
  }

  if (additionalCosts !== undefined && isNaN(additionalCosts)) {
    throw new Error("Additional costs must be a number.");
  }

  return true;
};

module.exports = { validatePriceCalculation };
