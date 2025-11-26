// src/services/userValidation.js

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export function validateUserInput({ name, email, password }) {
    if (!name || name.trim().length === 0) {
        const err = new Error("Név megadása kötelező!");
        err.status = 400;
        throw err;
    }

    if (!email || email.trim().length === 0) {
        const err = new Error("E-mail mező kitöltése kötelező!");
        err.status = 400;
        throw err;
    }

    if (!emailRegex.test(email)) {
        const err = new Error("Érvénytelen e-mail formátum!");
        err.status = 400;
        throw err;
    }

    if (!password || password.trim().length === 0) {
        const err = new Error("Jelszó megadása kötelező!");
        err.status = 400;
        throw err;
    }

    if (!passwordRegex.test(password)) {
        const err = new Error(
            "A jelszónak minimum 6 karakterből kell állnia, " +
            "és tartalmaznia kell kis- és nagybetűt, valamint számot!"
        );
        err.status = 400;
        throw err;
    }
}
