const mongoose = require("mongoose");
process.env.MONGO_URI = "mongodb://mongodb:27017/stone-guide-app";
const connectDB = require("../src/config/database");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("Database Connection", () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  test("should connect to MongoDB successfully", async () => {
    process.env.NODE_ENV = "development";
    process.env.MONGO_URI = "mongodb://mongodb:27017/stone-guide-app";

    mongoose.connect.mockResolvedValueOnce();

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://mongodb:27017/stone-guide-app",
      { dbName: "stone-guide-app" }
    );
  });

  test("should skip database connection when NODE_ENV is 'test'", async () => {
    process.env.NODE_ENV = "test";

    await connectDB();

    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  test("should handle database connection error", async () => {
    process.env.NODE_ENV = "development";
    process.env.MONGO_URI = "mongodb://mongodb:27017/stone-guide-app";

    mongoose.connect.mockRejectedValueOnce(new Error("Connection failed"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(() => {});

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "MongoDB connection error:",
      expect.any(Error)
    );

    expect(processExitSpy).toHaveBeenCalledWith(1);
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
