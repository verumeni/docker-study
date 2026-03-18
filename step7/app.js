const express = require("express");
const { createClient } = require("redis");

const app = express();
const port = process.env.PORT || 3000;

const redis = createClient({
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT || 6379}`,
});

redis.on("error", (e) => console.error("Redis error:", e));

async function main() {
  await redis.connect();

  app.get("/", async (_req, res) => {
    res.json({ result: "ok ok" });
  });

  app.get("/items", async (_req, res) => {
    const items = await redis.lRange("items", 0, -1);
    res.json({ items });
  });

  app.listen(port, "0.0.0.0", () => console.log(`listening on ${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});