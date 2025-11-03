import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET /api/bookings
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT b.id, u.name AS user_name, s.name AS service_name, e.name AS employee_name,
             b.start_time, b.end_time, b.status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN employees e ON b.employee_id = e.id
      ORDER BY b.start_time DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /bookings hiba:", err);
    res.status(500).json({ error: "Adatbázis hiba" });
  }
});

// POST /api/bookings
router.post("/", async (req, res) => {
  const { user_id, service_id, employee_id, start_time, end_time, status } = req.body;
  if (!user_id || !service_id || !employee_id || !start_time || !end_time)
    return res.status(400).json({ error: "Hiányzó mező(k)" });

  try {
    // ütközés-ellenőrzés
    const overlap = await pool.query(
      `SELECT * FROM bookings
       WHERE employee_id=$1
       AND tstzrange(start_time, end_time, '[]') && tstzrange($2, $3, '[]')`,
      [employee_id, start_time, end_time]
    );
    if (overlap.rows.length > 0)
      return res.status(400).json({ error: "Az időpont már foglalt" });

    const result = await pool.query(
      `INSERT INTO bookings (user_id, service_id, employee_id, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, service_id, employee_id, start_time, end_time, status || "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /bookings hiba:", err);
    res.status(500).json({ error: "Adatbázis beszúrási hiba" });
  }
});

// PUT /api/bookings/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET start_time=$1, end_time=$2, status=$3
       WHERE id=$4 RETURNING *`,
      [start_time, end_time, status, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Foglalás nem található" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /bookings hiba:", err);
    res.status(500).json({ error: "Adatbázis frissítési hiba" });
  }
});

// DELETE /api/bookings/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /bookings hiba:", err);
    res.status(500).json({ error: "Törlés sikertelen" });
  }
});

export default router;
