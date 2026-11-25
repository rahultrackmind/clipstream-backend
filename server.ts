import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.listen(PORT, () => console.log(`Listning to ${PORT} port`));
