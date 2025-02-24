const request = require("supertest");
const express = require("express");
const errorHandler = require("../src/middlewares/errorMiddleware");
const logger = require("../src/config/logger");

jest.mock("../src/config/logger");

describe("Error Middleware", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get("/error", (req, res, next) => {
      const err = new Error("Test error");
      err.status = 400;
      next(err);
    });

    app.get("/server-error", (req, res, next) => {
      next(new Error("Unexpected server error"));
    });

    app.get("/force-500", (req, res, next) => {
      res.status(200);
      next(new Error("Forced 500 error"));
    });

    app.use(errorHandler);
  });

  test("should return correct status and message for user error", async () => {
    const res = await request(app).get("/error");

    console.log("DEBUG RESPONSE:", res.body);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Test error");
  });

  test("should set status to 500 if it was originally 200", async () => {
    const res = await request(app).get("/force-500");

    console.log("DEBUG RESPONSE:", res.body);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Forced 500 error");
  });

  test("should include stack trace in development mode", async () => {
    process.env.NODE_ENV = "development";
    const res = await request(app).get("/server-error");

    console.log("DEBUG RESPONSE:", res.body);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Unexpected server error");
    expect(res.body.stack).toBeDefined();
  });

  test("should not include stack trace in production mode", async () => {
    process.env.NODE_ENV = "production";
    const res = await request(app).get("/server-error");

    console.log("DEBUG RESPONSE:", res.body);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Unexpected server error");
    expect(res.body.stack).toBeNull();
  });

  test("should log the error", async () => {
    await request(app).get("/server-error");

    expect(logger.error).toHaveBeenCalledWith(
      "Unexpected server error - GET /server-error"
    );
  });
});
