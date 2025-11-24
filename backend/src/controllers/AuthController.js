import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Email formátum ellenőrzése
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export default class AuthController {

    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || name.trim().length === 0) {
                return res.status(400).json({ error: "Név megadása kötelező!" });
            }

            if (!email || email.trim().length === 0) {
                return res.status(400).json({ error: "E-mail mező kitöltése kötelező!" });
            }
            if (!password || password.trim().length === 0) {
                return res.status(400).json({ error: "Jelszó megadása kötelező!" });
            }

            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Érvénytelen e-mail formátum!" });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    error: "A jelszónak minimum 6 karakterből kell állnia, és tartalmaznia kell kis- és nagybetűt, valamint számot!"
                });
            }

            const existing = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                [email]
            );
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: "A megadott e-mail cím vagy jelszó hibás." });
            }

            const hash = await bcrypt.hash(password, 10);

            const result = await pool.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name, email, hash, "user"]
            );

            res.status(201).json(result.rows[0]);

        } catch (err) {
            console.error("AUTH REGISTER ERROR:", err);
            res.status(500).json({ error: "A regisztráció nem sikerült. Kérjük, próbálja meg újra." });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || email.trim().length === 0) {
                return res.status(400).json({ error: "Email mező kitöltése kötelező!" });
            }

            if (!password || password.trim().length === 0) {
                return res.status(400).json({ error: "Jelszó megadása kötelező!" });
            }

            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Érvénytelen email formátum!" });
            }


            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ error: "Helytelen email vagy jelszó!" });
            }

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
                return res.status(401).json({ error: "Helytelen email vagy jelszó!" });
            }

            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role },
                JWT_SECRET,
                { expiresIn: "3h" }
            );

            res.json({
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            });

        } catch (err) {
            console.error("AUTH LOGIN ERROR:", err);
            res.status(500).json({ error: "Váratlan hiba történt a bejelentkezés során!" });
        }
    }
}
