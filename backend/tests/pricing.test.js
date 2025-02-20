const request = require("supertest");
const app = require("../src/server");
const Stone = require("../src/models/Stone");
const mongoose = require("mongoose");

describe("Pricing API", () => {
  let stoneId;

  beforeAll(async () => {
    const stone = await Stone.create({
      name: "Test Stone",
      type: "granite",
      color: "gray",
      pricePerM2: 100,
      usage: ["kitchen"],
      location: "Showroom A",
    });
    stoneId = stone._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should calculate price correctly", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("priceEUR");
    expect(res.body).toHaveProperty("pricePLN");
    expect(res.body.areaM2).toBeCloseTo(1.08);
  });

  test("should return error for invalid stone ID", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId: "000000000000000000000000",
      length: 60,
      width: 180,
      unit: "cm",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Stone not found.");
  });

  test("should return error for missing fields", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      unit: "cm",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "All fields are required: stoneId, length, width, unit."
    );
  });
});
