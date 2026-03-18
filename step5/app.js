const express = require("express");
const { createClient } = require("redis");

const app = express();
const port = process.env.PORT || 3000;

const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = process.env.REDIS_PORT || 6379;
const redisUrl = process.env.REDIS_URL || `redis://${redisHost}:${redisPort}`;

const redis = createClient({ url: redisUrl });

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

async function main() {
  await redis.connect();

  app.get("/", async (_req, res) => {
    const count = await redis.incr("hits");
    res.json({ message: "Hello with Redis", hits: count });
  });

  app.get("/health", async (_req, res) => {
    const pong = await redis.ping();
    res.json({ status: "ok", redis: pong });
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});