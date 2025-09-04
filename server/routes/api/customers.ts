// server/routes/api/customers.ts
import { Router } from "express";
import { db } from "../../db/client";  // ✅ fixed import
import { customers } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET all customers
router.get("/", async (_req, res) => {
  try {
    const result = await db.select().from(customers);
    res.json(result);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// GET single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id));
    if (result.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// CREATE a new customer
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, gstin, email, referenceNo } = req.body;

    if (!name || !referenceNo) {
      return res
        .status(400)
        .json({ error: "Name and referenceNo are required" });
    }

    const result = await db
      .insert(customers)
      .values({
        name,
        phone: phone || null,
        address: address || null,
        gstin: gstin || null,
        email: email || null,
        referenceNo,
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// UPDATE customer
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, phone, address, gstin, email, referenceNo } = req.body;

    const result = await db
      .update(customers)
      .set({
        name,
        phone: phone || null,
        address: address || null,
        gstin: gstin || null,
        email: email || null,
        referenceNo,
      })
      .where(eq(customers.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// DELETE customer
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;
