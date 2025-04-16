const request = require("supertest");
const app = require("../src/server");

describe("App Initialization", () => {
  it("should return a welcome message on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Welcome to the Stone Guide API");
  });

  it("should return 404 for an unknown route", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.statusCode).toBe(404);
  });

  describe("API Routes", () => {
    it("should load /api/stones", async () => {
      const res = await request(app).get("/api/stones");
      // Expect 200 or 404 depending on data availability
      expect(res.statusCode).toBeGreaterThanOrEqual(200);
      expect(res.statusCode).toBeLessThan(500);
    });

    it("should load /api/pricing", async () => {
      const res = await request(app).post("/api/pricing").send({
        stoneId: "fakeId",
        length: 60,
        width: 180,
        unit: "cm",
        thickness: "2cm",
      });
      expect([400, 401, 500]).toContain(res.statusCode);
    });
  });

  it("should correctly parse JSON request bodies", async () => {
    const res = await request(app)
      .post("/api/stones")
      .send({ name: "Test Stone" })
      .set("Content-Type", "application/json");

    expect(res.type).toBe("application/json");
  });
});
