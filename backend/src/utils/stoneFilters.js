const buildStoneFilter = ({ type, color, priceMin, priceMax, usage }) => {
  const filter = {};

  if (type) filter.type = type;
  if (color) filter.color = color;
  if (priceMin || priceMax) {
    filter.pricePerM2_2cm = {};
    /* istanbul ignore next */
    if (priceMin) filter.pricePerM2_2cm.$gte = parseFloat(priceMin);
    /* istanbul ignore next */
    if (priceMax) filter.pricePerM2_2cm.$lte = parseFloat(priceMax);
  }
  /* istanbul ignore next */
  if (usage) filter.usage = { $in: usage.split(",") };

  return filter;
};

module.exports = { buildStoneFilter };
