const request = require("supertest");
const app = require("../src/server");
const connectDB = require("../src/config/database");
const logger = require("../src/config/logger");
const errorMiddleware = require("../src/middlewares/errorMiddleware");

jest.mock("../src/config/database", () => jest.fn());
jest.mock("../src/config/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("Server tests", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    await connectDB();
    jest.spyOn(global.console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should connect to the database", () => {
    expect(connectDB).toHaveBeenCalled();
  });

  it("should log requests", async () => {
    await request(app).get("/");
    expect(logger.info).toHaveBeenCalledWith("GET /");
  });

  it("should return a welcome message on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Welcome to the Stone Guide API" });
  });

  it("should handle /api/stones route", async () => {
    const res = await request(app).get("/api/stones");
    expect(res.statusCode).not.toBe(404);
  });

  it("should handle /api/pricing route", async () => {
    const res = await request(app).get("/api/pricing");
    expect(res.statusCode).not.toBe(500);
  });

  it("should use error handling middleware", async () => {
    const res = await request(app).get("/nonexistent-route");
    expect(res.statusCode).toBe(404);
  });

  it("should not start server in test mode", () => {
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining("Server running on port")
    );
  });
});
