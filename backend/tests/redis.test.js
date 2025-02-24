const redis = require("../src/config/redis");

describe("Redis Connection", () => {
  test("should log an error if Redis connection fails", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    redis.emit("error", new Error("Redis failed to connect"));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Redis connection error:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
