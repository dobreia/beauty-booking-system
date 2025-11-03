import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/employees
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employees ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("GET /employees hiba:", err);
        res.status(500).json({ error: "Adatbázis hiba" });
    }
});

// POST /api/employees
router.post("/", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email)
        return res.status(400).json({ error: "Hiányzó név vagy e-mail" });

    try {
        const result = await pool.query(
            "INSERT INTO employees (name, email) VALUES ($1, $2) RETURNING *",
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("POST /employees hiba:", err);
        res.status(500).json({ error: "Adatbázis beszúrási hiba" });
    }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            "UPDATE employees SET name=$1, email=$2 WHERE id=$3 RETURNING *",
            [name, email, id]
        );
        if (result.rowCount === 0)
            return res.status(404).json({ error: "Munkatárs nem található" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /employees hiba:", err);
        res.status(500).json({ error: "Adatbázis frissítési hiba" });
    }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM employees WHERE id=$1", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /employees hiba:", err);
        res.status(500).json({ error: "Törlés sikertelen" });
    }
});

export default router;
