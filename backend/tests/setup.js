const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
jest.mock("../src/config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
  flushall: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
  emit: jest.fn(),
  status: "ready",
}));

const redis = require("../src/config/redis");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { dbName: "testdb" });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  await mongoServer.stop();
  if (redis.status === "ready") {
    await redis.quit();
  }
}, 15000);
