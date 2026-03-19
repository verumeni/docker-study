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

  app.get("/write", async (req, res) => {
  const filePath = process.env.WRITE_PROBE_PATH || "/tmp/probe.txt";
  const message =`write test at ${new Date().toISOString()}`;

  try {
    await fs.writeFile(filePath, `${message}\n`, { encoding: "utf8", flag: "a" });
    res.json({ ok: true, path: filePath, message });
  } catch (err) {
    console.error("Write failed:", err);
    res.status(500).json({
      ok: false,
      error: err.code || "WRITE_FAILED",
      message: err.message,
      path: filePath
    });
  }
});

  app.listen(port, "0.0.0.0", () => console.log(`listening on ${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});