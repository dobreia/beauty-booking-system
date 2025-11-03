import express from "express";
import BookingsController from "../controllers/BookingsController.js";

const router = express.Router();

// GET all bookings
router.get("/", async (req, res) => {
  try {
    res.json(await BookingsController.getAll());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST new booking
router.post("/", async (req, res) => {
  try {
    res.status(201).json(await BookingsController.create(req.body));
  } catch (e) {
    // ha az ütközés miatt hiba, adjunk 400-at
    const status = e.message.includes("foglal") ? 400 : 500;
    res.status(status).json({ error: e.message });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    res.json(await BookingsController.delete(req.params.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
