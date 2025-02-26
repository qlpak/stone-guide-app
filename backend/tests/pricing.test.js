const request = require("supertest");
const app = require("../src/server");
const Stone = require("../src/models/Stone");
const mongoose = require("mongoose");
const redis = require("../src/config/redis");
const logger = require("../src/config/logger");
const { getExchangeRate } = require("../src/utils/exchangeRate");
const { convertToM2 } = require("../src/utils/convertToM2");

const axios = require("axios");

jest.mock("axios");
jest.mock("../src/config/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));
jest.mock("../src/config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
  flushall: jest.fn(),
  quit: jest.fn(),
}));

describe("Pricing API", () => {
  let stoneId;

  beforeAll(async () => {
    await redis.flushall();

    const stone = await Stone.create({
      name: "Test Stone",
      type: "granite",
      color: "gray",
      pricePerM2_2cm: 100,
      pricePerM2_3cm: 150,
      usage: ["kitchen"],
      location: "Showroom A",
    });

    stoneId = stone._id.toString();
  });

  afterAll(async () => {
    await redis.quit();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
  test("should log error when exchange rate API fails", async () => {
    logger.error.mockClear();
    axios.get.mockRejectedValue(new Error("API down"));

    await expect(getExchangeRate()).resolves.toEqual({
      eurRate: 4.5,
      usdRate: 1.08,
    });

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching exchange rates:",
      expect.any(Error)
    );
  });

  test("should convert cm2 to m2 correctly", () => {
    expect(convertToM2(10000, null, "cm2")).toBe(1);
  });

  test("should convert meters to m2 correctly", () => {
    expect(convertToM2(2, 3, "m")).toBe(6);
  });

  test("should return the length for m2 input", () => {
    expect(convertToM2(4, null, "m2")).toBe(4);
  });

  test("should log when retrieving exchange rates from cache", async () => {
    redis.get.mockResolvedValue(
      JSON.stringify({ eurRate: 4.5, usdRate: 1.08 })
    );
    const rates = await getExchangeRate();
    expect(logger.info).toHaveBeenCalledWith(
      "Exchange rates retrieved from cache"
    );
    expect(rates).toEqual({ eurRate: 4.5, usdRate: 1.08 });
  });

  test("should set exchange rates in cache when retrieved from API", async () => {
    redis.get.mockResolvedValue(null);
    axios.get.mockResolvedValue({ data: { eur: { pln: 4.5, usd: 1.08 } } });
    await getExchangeRate();
    expect(redis.set).toHaveBeenCalledWith(
      "exchange_rates",
      JSON.stringify({ eurRate: 4.5, usdRate: 1.08 }),
      "EX",
      86400
    );
    expect(logger.info).toHaveBeenCalledWith(
      "Exchange rates retrieved from API"
    );
  });

  test("should select correct price per m2 for 3cm thickness", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 100,
      width: 100,
      unit: "cm",
      thickness: "3cm",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.priceEUR).toBeCloseTo(150);
  });

  test("should retrieve exchange rates before price calculation", async () => {
    redis.get.mockResolvedValue(
      JSON.stringify({ eurRate: 4.5, usdRate: 1.08 })
    );
    await request(app).post("/api/pricing").send({
      stoneId,
      length: 100,
      width: 100,
      unit: "cm",
      thickness: "2cm",
    });
    expect(logger.info).toHaveBeenCalledWith(
      "Exchange rates retrieved from cache"
    );
  });

  test("should handle additional costs correctly", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 100,
      width: 100,
      unit: "cm",
      thickness: "2cm",
      additionalCosts: 50,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.priceEUR).toBeCloseTo(150);
  });

  test("should default additional costs to 0 if not provided", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 100,
      width: 100,
      unit: "cm",
      thickness: "2cm",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.priceEUR).toBeCloseTo(100);
  });

  test("should calculate price correctly for 2cm", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    logger.info("Response body:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("priceEUR");
    expect(res.body).toHaveProperty("pricePLN");
    expect(res.body).toHaveProperty("priceUSD");
  });

  test("should return error for missing thickness", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "All fields are required: stoneId, length, width, unit, thickness."
    );
  });

  test("should return 400 for invalid stoneId format", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId: "invalidId",
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid stone ID format.");
  });

  test("should return 404 for non-existent stoneId", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId: new mongoose.Types.ObjectId(),
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Stone not found.");
  });

  test("should return 400 for invalid unit", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "feet",
      thickness: "2cm",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid unit provided.");
  });

  test("should return 400 for negative dimensions", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: -60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid dimensions provided.");
  });

  test("should return 400 for non-numeric additionalCosts", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
      additionalCosts: "fifty",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Additional costs must be a number.");
  });

  test("should handle exchange rate API failure gracefully", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject(new Error("API down")));

    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("priceEUR");
    expect(res.body).toHaveProperty("pricePLN");
    expect(res.body).toHaveProperty("priceUSD");

    global.fetch.mockRestore();
  });

  test("should return 500 if database query fails", async () => {
    jest.spyOn(Stone, "findById").mockImplementationOnce(() => {
      throw new Error("Database failure");
    });

    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");

    jest.restoreAllMocks();
  });
});

test("should return 400 for invalid thickness value", async () => {
  logger.warn.mockClear();

  const res = await request(app).post("/api/pricing").send({
    stoneId: new mongoose.Types.ObjectId().toString(),
    length: 60,
    width: 180,
    unit: "cm",
    thickness: "5cm",
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBe("Thickness must be either '2cm' or '3cm'.");

  expect(logger.warn).toHaveBeenCalledTimes(1);
  expect(logger.warn).toHaveBeenCalledWith(
    "Invalid thickness value received: 5cm"
  );
});
