import pool from "../src/db.js";

export default async () => {
    await pool.end(); // DB kapcsolat lezárása
};
