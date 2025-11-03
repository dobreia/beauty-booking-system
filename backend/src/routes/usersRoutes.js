import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/users
 * Összes felhasználó lekérése
 */
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("GET /users hiba:", err);
        res.status(500).json({ error: "Adatbázis hiba" });
    }
});

/**
 * POST /api/users
 * Új felhasználó létrehozása (admin form)
 */
router.post("/", async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email)
        return res.status(400).json({ error: "Hiányzó név vagy e-mail" });

    try {
        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, 'defaultpass', $3) RETURNING id, name, email, role",
            [name, email, role || "user"]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("POST /users hiba:", err);
        res.status(500).json({ error: "Adatbázis beszúrási hiba" });
    }
});

/**
 * PUT /api/users/:id
 * Felhasználó módosítása (formból)
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
       SET name=$1, email=$2, role=$3 
       WHERE id=$4 
       RETURNING id, name, email, role`,
            [name, email, role, id]
        );
        if (result.rowCount === 0)
            return res.status(404).json({ error: "Felhasználó nem található" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error("PUT /users hiba:", err);
        res.status(500).json({ error: "Adatbázis frissítési hiba" });
    }
});

/**
 * DELETE /api/users/:id
 * Felhasználó törlése
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM users WHERE id=$1", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error("DELETE /users hiba:", err);
        res.status(500).json({ error: "Törlés sikertelen" });
    }
});

export default router;
