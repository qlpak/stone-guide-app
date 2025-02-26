const Stone = require("../models/Stone");
const { buildStoneFilter } = require("../utils/stoneFilters");

const getStonesService = async (query) => {
  const { page = 1, limit = 10, ...filters } = query;
  const filter = buildStoneFilter(filters);

  const stones = await Stone.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Stone.countDocuments(filter);
  return {
    stones,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getStoneByIdService = async (id) => {
  return Stone.findById(id);
};

const createStoneService = async (stoneData) => {
  return Stone.create(stoneData);
};

const searchStonesService = async (query, usage) => {
  const filter = {};
  if (query) filter.name = { $regex: query, $options: "i" };
  if (usage && typeof usage === "string") {
    filter.usage = { $in: usage.split(",") };
  }
  return Stone.find(filter);
};

const getRecommendedStonesService = async (id) => {
  const stone = await Stone.findById(id);
  if (!stone) return null;
  return Stone.find({
    type: stone.type,
    color: stone.color,
    _id: { $ne: stone._id },
  }).limit(5);
};

module.exports = {
  getStonesService,
  getStoneByIdService,
  createStoneService,
  searchStonesService,
  getRecommendedStonesService,
};
