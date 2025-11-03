import pool from "../db.js";

export default class BookingsController {
    static async getAll() {
        const query = `
    SELECT 
      b.id, b.start_time, b.end_time, b.status,
      u.name AS user_name,
      s.name AS service_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
    ORDER BY b.start_time DESC;
  `;
        const result = await pool.query(query);
        return result.rows;
    }


    static async create({ user_id, service_id, start_time, end_time }) {
        const conflict = await pool.query(
            `SELECT * FROM bookings
   WHERE service_id = $1
   AND NOT ($3 <= start_time OR $2 >= end_time)`,
            [service_id, start_time, end_time]
        );

        if (conflict.rows.length > 0)
            throw new Error("Ez az időpont már foglalt!");

        const result = await pool.query(
            `INSERT INTO bookings (user_id, service_id, start_time, end_time, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
            [user_id, service_id, start_time, end_time]
        );
        return result.rows[0];
    }


    static async delete(id) {
        await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
        return { message: "Foglalás törölve" };
    }
}
