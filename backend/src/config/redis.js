const Redis = require("ioredis");
const fs = require("fs");

const getSecret = (name) => {
  const path = `/run/secrets/${name}`;
  return fs.existsSync(path) ? fs.readFileSync(path, "utf-8").trim() : null;
};

const host =
  getSecret("redis_host") || process.env.REDIS_HOST || "stone-guide-redis";
const port = getSecret("redis_port") || process.env.REDIS_PORT || 6379;

const redis = new Redis({
  host,
  port: parseInt(port, 10),
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

module.exports = redis;
