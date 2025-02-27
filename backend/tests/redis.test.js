const redis = require("../src/config/redis");

describe("Redis Connection", () => {
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
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
