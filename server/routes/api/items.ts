import { Router } from "express";

const router = Router();

// Example: GET /api/items
router.get("/", (req, res) => {
  res.json({ message: "Items route is working!" });
});

// Example: POST /api/items
router.post("/", (req, res) => {
  const { name } = req.body;
  res.json({ success: true, item: { name } });
});

export default router;
