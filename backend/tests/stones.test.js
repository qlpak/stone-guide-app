const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const Stone = require("../src/models/Stone");
const logger = require("../src/config/logger");
const connectDB = require("../src/config/database");

jest.mock("../src/config/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../src/middlewares/auth", () => (req, res, next) => {
  req.auth = {
    realm_access: { roles: ["admin"] }, // or ['user']
  };
  next();
});

describe("Stone API", () => {
  let stoneId;

  beforeAll(async () => {
    const stone = await Stone.create({
      name: "Taj Mahal",
      type: "quartzite",
      color: "Beige",
      pricePerM2_2cm: 274.86,
      pricePerM2_3cm: 350,
      usage: ["kitchen"],
      location: "Showroom Table A",
    });

    stoneId = stone._id;

    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("should filter stones by color", async () => {
    const res = await request(app).get("/api/stones?color=Beige");

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
    expect(res.body.stones.length).toBeGreaterThan(0);
    expect(res.body.stones[0].color).toBe("Beige");
  });

  test("should filter stones by price range", async () => {
    const res = await request(app).get("/api/stones?priceMin=200&priceMax=300");

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
    expect(res.body.stones.length).toBeGreaterThan(0);
    expect(res.body.stones[0].pricePerM2_2cm).toBeGreaterThanOrEqual(200);
    expect(res.body.stones[0].pricePerM2_2cm).toBeLessThanOrEqual(300);
  });

  test("should search stones by name using regex", async () => {
    const res = await request(app).get("/api/stones/search?query=Taj Mahal");

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
    expect(res.body.stones.length).toBeGreaterThan(0);
    expect(res.body.stones[0].name).toMatch(/Taj Mahal/i);
  });

  test("should return 500 and log error when fetching stone by ID fails", async () => {
    logger.error.mockClear();
    jest
      .spyOn(Stone, "findById")
      .mockRejectedValue(new Error("Database failure"));

    const res = await request(app).get(`/api/stones/${global.stoneId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Server error");
    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching stone by ID",
      expect.any(Object)
    );
  });

  test("should return 400 and log warning when missing price fields in request", async () => {
    logger.warn.mockClear();
    const res = await request(app)
      .post("/api/stones")
      .send({
        name: "Test Stone",
        type: "granite",
        color: "gray",
        usage: ["bathroom"],
        location: "Showroom B",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("At least one price (2cm or 3cm) is required.");
    expect(logger.warn).toHaveBeenCalledWith(
      "At least one price is required",
      expect.any(Object)
    );
  });
  test("should return 500 and log error when creating a stone fails", async () => {
    logger.error.mockClear();
    jest
      .spyOn(Stone, "create")
      .mockRejectedValue(new Error("Database failure"));

    const res = await request(app)
      .post("/api/stones")
      .send({
        name: "Test Stone",
        type: "granite",
        color: "gray",
        pricePerM2_2cm: 100,
        pricePerM2_3cm: 150,
        usage: ["bathroom"],
        location: "Showroom B",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");
    expect(logger.error).toHaveBeenCalledWith(
      "Error creating stone",
      expect.any(Object)
    );
  });

  test("should return 400 and log warning when search parameters are missing", async () => {
    logger.warn.mockClear();
    const res = await request(app).get("/api/stones/search");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing search parameters");
    expect(logger.warn).toHaveBeenCalledWith(
      "Missing search parameters",
      expect.any(Object)
    );
  });

  test("should correctly parse usage parameter in search", async () => {
    const res = await request(app).get(
      "/api/stones/search?query=Taj Mahal&usage=kitchen,bathroom"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
  });

  test("should return 500 and log error when searching stones fails", async () => {
    logger.error.mockClear();
    jest.spyOn(Stone, "find").mockImplementationOnce(() => {
      throw new Error("Database failure");
    });

    const res = await request(app).get("/api/stones/search?query=Taj Mahal");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Database failure");
    expect(logger.error).toHaveBeenCalledWith(
      "Error searching stones",
      expect.any(Object)
    );

    jest.restoreAllMocks();
  });

  test("should return 500 and log error when fetching recommended stones fails", async () => {
    logger.error.mockClear();
    const fakeId = new mongoose.Types.ObjectId();
    jest.spyOn(Stone, "findById").mockImplementationOnce(() => {
      throw new Error("Database failure");
    });

    const res = await request(app).get(`/api/stones/recommendations/${fakeId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");
    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching recommended stones",
      expect.any(Object)
    );

    jest.restoreAllMocks();
  });

  test("should get a list of stones with pagination and filters", async () => {
    const res = await request(app).get(
      "/api/stones?type=quartzite&priceMin=100&priceMax=300&page=1&limit=5"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBeGreaterThan(0);
  });

  test("should get a stone by ID", async () => {
    const res = await request(app).get(`/api/stones/${stoneId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Taj Mahal");
  });

  test("should return 404 for non-existent stone ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/stones/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Stone not found");
  });

  test("should create a new stone", async () => {
    const res = await request(app)
      .post("/api/stones")
      .send({
        name: "Carrara",
        type: "marble",
        color: "White",
        pricePerM2_2cm: 200,
        pricePerM2_3cm: 250,
        usage: ["bathroom"],
        location: "Showroom Table B",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Carrara");
  });

  test("should return 400 for missing required fields", async () => {
    const res = await request(app).post("/api/stones").send({
      name: "No Type Stone",
      color: "Gray",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing required fields.");
  });

  test("should search stones by name", async () => {
    const res = await request(app).get("/api/stones/search?query=Taj Mahal");

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
    expect(res.body.stones.length).toBeGreaterThan(0);
    expect(res.body.stones[0].name).toMatch(/Taj Mahal/i);
  });

  test("should return 200 and empty array when no stones match the search", async () => {
    const res = await request(app).get(
      "/api/stones/search?query=NonExistentStone"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.stones).toBeInstanceOf(Array);
    expect(res.body.stones.length).toBe(0);
  });

  test("should return recommended stones based on type and color", async () => {
    const stone1 = await Stone.create({
      name: "Black Galaxy",
      type: "granite",
      color: "Black",
      pricePerM2_2cm: 200,
      pricePerM2_3cm: 250,
      usage: ["kitchen"],
      location: "Showroom A",
    });

    const stone2 = await Stone.create({
      name: "Absolute Black",
      type: "granite",
      color: "Black",
      pricePerM2_2cm: 180,
      pricePerM2_3cm: 230,
      usage: ["bathroom"],
      location: "Showroom B",
    });

    const res = await request(app).get(
      `/api/stones/recommendations/${stone1._id}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].type).toBe(stone1.type);
    expect(res.body[0].color).toBe(stone1.color);
  });

  test("should return 404 for recommended stones if stone ID does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/stones/recommendations/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Stone not found.");
  });

  test("should return 500 if database query fails", async () => {
    jest.spyOn(Stone, "find").mockImplementationOnce(() => {
      throw new Error("Database failure");
    });

    const res = await request(app).get("/api/stones");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal Server Error");

    jest.restoreAllMocks();
  });
});
