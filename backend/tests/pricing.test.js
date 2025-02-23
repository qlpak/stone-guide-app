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
      pricePerM2_2cm: 100,
      pricePerM2_3cm: 150,
      usage: ["kitchen"],
      location: "Showroom A",
    });
    stoneId = stone._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should calculate price correctly for 2cm", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "2cm",
    });

    console.log("Response body:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("priceEUR");
    expect(res.body).toHaveProperty("pricePLN");
    expect(res.body).toHaveProperty("priceUSD");
  });

  test("should calculate price correctly for 3cm", async () => {
    const res = await request(app).post("/api/pricing").send({
      stoneId,
      length: 60,
      width: 180,
      unit: "cm",
      thickness: "3cm",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.priceEUR).toBeCloseTo(1.08 * 150);
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
});
