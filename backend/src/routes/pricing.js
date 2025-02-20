const express = require("express");
const { calculatePrice } = require("../controllers/pricingController");

const router = express.Router();

router.post("/", calculatePrice);

module.exports = router;
