const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ message: "Hello from Docker Node app" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});