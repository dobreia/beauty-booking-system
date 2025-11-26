// controllers/UsersController.js
import pool from "../db.js";
import bcrypt from "bcrypt";
import { validateUserInput } from "../lib/validateUser.js";

const SALT_ROUNDS = 10;

export default class UsersController {

    static async getAll() {
        const result = await pool.query(
            "SELECT id, name, email, role FROM users ORDER BY id"
        );
        return result.rows;
    }


    // ===============================================
    // CREATE USER (Admin panel)
    // ===============================================
    static async create({ name, email, role, password }) {

        // 🔍 ugyanaz a validáció, mint a regisztrációnál
        const validationError = validateUserInput({ name, email, password });
        if (validationError) {
            const err = new Error(validationError);
            err.status = 400;
            throw err;
        }

        const finalRole = role === "admin" ? "admin" : "user";
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            const result = await pool.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name.trim(), email.trim(), hash, finalRole]
            );
            return result.rows[0];

        } catch (e) {
            if (e.code === "23505") {
                const err = new Error("Ez az email már létezik.");
                err.status = 409;
                throw err;
            }
            throw e;
        }
    }


    // ===============================================
    // UPDATE ROLE — Admin only
    // ===============================================
    static async updateRole(id, { role }, currentUserId) {

        const finalRole = role === "admin" ? "admin" : "user";

        // ❌ Admin magát nem fokozhatja le sima userre
        if (id == currentUserId && finalRole !== "admin") {
            const err = new Error("Saját admin jogosultság nem szüntethető meg!");
            err.status = 403;
            throw err;
        }

        const result = await pool.query(
            "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role",
            [finalRole, id]
        );

        if (result.rowCount === 0) {
            const err = new Error("Felhasználó nem található.");
            err.status = 404;
            throw err;
        }

        return result.rows[0];
    }


    // ===============================================
    // DELETE — Admin only
    // ===============================================
    static async delete(id, currentUserId) {

        // ❌ Saját fiók védelme
        if (id == currentUserId) {
            const err = new Error("Saját fiók nem törölhető!");
            err.status = 403;
            throw err;
        }

        // ❌ Utolsó admin törlésének megakadályozása
        const adminCount = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role='admin'"
        );

        if (adminCount.rows[0].count <= 1) {
            const err = new Error("Az utolsó admin nem törölhető!");
            err.status = 403;
            throw err;
        }

        const result = await pool.query(
            "DELETE FROM users WHERE id=$1", [id]
        );

        if (result.rowCount === 0) {
            const err = new Error("Felhasználó nem található.");
            err.status = 404;
            throw err;
        }

        return { message: "Felhasználó törölve" };
    }
}
