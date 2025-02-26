const express = require("express");
const {
  calculatePriceController,
} = require("../controllers/pricingController");

const router = express.Router();

router.post("/", calculatePriceController);

module.exports = router;
