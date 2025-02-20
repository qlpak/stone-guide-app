const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const Stone = require("../src/models/Stone");

describe("Stone API", () => {
  let stoneId;

  beforeAll(async () => {
    const stone = await Stone.create({
      name: "Taj Mahal",
      type: "granite",
      color: "Beige",
      pricePerM2_2cm: 274.86,
      usage: ["kitchen"],
      location: "Showroom Table A",
    });

    stoneId = stone._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should get a stone by ID", async () => {
    const res = await request(app).get(`/api/stones/${stoneId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Taj Mahal");
  });

  test("should create a new stone", async () => {
    const res = await request(app)
      .post("/api/stones")
      .send({
        name: "Carrara",
        type: "marble",
        color: "White",
        pricePerM2_2cm: 200,
        usage: ["bathroom"],
        location: "Showroom Table B",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Carrara");
  });
});
