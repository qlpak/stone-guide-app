jest.setTimeout(15000); // Increase timeout for Mongo operations

const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const Stone = require("../src/models/Stone");
const connectDB = require("../src/config/database");

jest.mock("../src/middlewares/auth", () => (req, res, next) => {
  req.auth = {
    realm_access: { roles: ["admin"] },
  };
  next();
});

beforeAll(async () => {
  await connectDB();
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB not connected");
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (err) {
    console.error("afterAll teardown error:", err);
  }
});

describe("filterRecommendations", () => {
  beforeEach(async () => {
    await Stone.deleteMany({});
    await Stone.create([
      {
        name: "Verde Marina",
        type: "granite",
        color: "Green",
        pricePerM2_2cm: 200,
        pricePerM2_3cm: 250,
        usage: ["kitchen", "bathroom"],
        location: "Showroom X",
      },
      {
        name: "Bianco Carrara",
        type: "marble",
        color: "White",
        pricePerM2_2cm: 150,
        pricePerM2_3cm: 200,
        usage: ["bathroom"],
        location: "Showroom Y",
      },
    ]);
  });

  test("should filter by color and usage", async () => {
    const res = await request(app).get(
      "/api/stones/recommend?color=Green&usage=kitchen"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Verde Marina");
  });

  test("should filter by price range", async () => {
    const res = await request(app).get("/api/stones/recommend?min=100&max=160");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Bianco Carrara");
  });

  test("should return 500 on DB error", async () => {
    jest.spyOn(Stone, "find").mockImplementationOnce(() => {
      throw new Error("DB fail");
    });

    const res = await request(app).get("/api/stones/recommend?color=Green");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to fetch recommendations");

    jest.restoreAllMocks();
  });
});

describe("compareStones", () => {
  let stoneIds;

  beforeEach(async () => {
    await Stone.deleteMany({});
    const created = await Stone.create([
      {
        name: "Stone A",
        type: "granite",
        color: "Black",
        pricePerM2_2cm: 100,
        pricePerM2_3cm: 150,
        usage: ["kitchen"],
        location: "Shelf A",
      },
      {
        name: "Stone B",
        type: "marble",
        color: "White",
        pricePerM2_2cm: 110,
        pricePerM2_3cm: 160,
        usage: ["bathroom"],
        location: "Shelf B",
      },
      {
        name: "Stone C",
        type: "quartzite",
        color: "Gray",
        pricePerM2_2cm: 120,
        pricePerM2_3cm: 170,
        usage: ["stairs"],
        location: "Shelf C",
      },
    ]);
    stoneIds = created.map((s) => s._id.toString());
  });

  test("should return 200 and 3 compared stones", async () => {
    const res = await request(app)
      .post("/api/stones/compare")
      .send({ ids: stoneIds });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(3);
  });

  test("should return 400 if not 3 IDs", async () => {
    const res = await request(app)
      .post("/api/stones/compare")
      .send({ ids: [stoneIds[0]] });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Please provide exactly 3 stone IDs.");
  });

  test("should return 404 if one stone is missing", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post("/api/stones/compare")
      .send({ ids: [stoneIds[0], stoneIds[1], fakeId] });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("One or more stones not found.");
  });

  test("should return 500 on DB error", async () => {
    jest.spyOn(Stone, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app)
      .post("/api/stones/compare")
      .send({ ids: stoneIds });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Internal server error");

    jest.restoreAllMocks();
  });
});
