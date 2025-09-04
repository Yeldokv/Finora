// server/index.ts
import express from "express";
import path from "path";
import customersRouter from "./routes/api/customers";
import itemsRouter from "./routes/api/items";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.use("/api/customers", customersRouter);
app.use("/api/items", itemsRouter);

// ✅ Serve React build in production
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`[express] serving on http://127.0.0.1:${PORT}`);
});
