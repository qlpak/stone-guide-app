const EventEmitter = require("events");

class MockRedis extends EventEmitter {}

describe("Redis Connection", () => {
  let consoleErrorSpy;
  let consoleLogSpy;
  let redis;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    redis = new MockRedis();

    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    redis.on("connect", () => {
      console.log("Connected to Redis successfully!");
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  test("should log an error if Redis connection fails", () => {
    redis.emit("error", new Error("Redis failed to connect"));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Redis connection error:",
      expect.any(Error)
    );
  });

  test("should log a success message when Redis connects successfully", () => {
    redis.emit("connect");

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Connected to Redis successfully!"
    );
  });
});
