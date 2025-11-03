import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ GET /api/services - összes szolgáltatás lekérése
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM services ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// ✅ POST /api/services - új szolgáltatás létrehozása
router.post("/", async (req, res) => {
    const { name, duration_minutes, price_cents } = req.body;

    if (!name || !duration_minutes || !price_cents) {
        return res.status(400).json({ error: "Hiányzó mező(k)" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO services (name, duration_minutes, price_cents, active)
             VALUES ($1, $2, $3, true)
             RETURNING *`,
            [name, duration_minutes, price_cents]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("POST /services hiba:", err);
        res.status(500).json({ error: "Adatbázis hiba a beszúrásnál" });
    }
});

// ✅ PUT /api/services/:id - meglévő szolgáltatás frissítése
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, duration_minutes, price_cents, active } = req.body;

    try {
        const result = await pool.query(
            `UPDATE services 
             SET name = $1, duration_minutes = $2, price_cents = $3, active = COALESCE($4, active)
             WHERE id = $5
             RETURNING *`,
            [name, duration_minutes, price_cents, active, id]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "Szolgáltatás nem található" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /services hiba:", err);
        res.status(500).json({ error: "Adatbázis hiba a frissítésnél" });
    }
});

// ✅ DELETE /api/services/:id - szolgáltatás törlése
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM services WHERE id = $1", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /services hiba:", err);
        res.status(500).json({ error: "Adatbázis hiba a törlésnél" });
    }
});

export default router;
