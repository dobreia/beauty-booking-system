import request from "supertest";
import app from "../src/server.js";

describe("Auth tests", () => {
    test("Hibás login -> 401", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "admin@example.com", password: "rossz" });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBeDefined();
    });

    test("Regisztráció üres email -> 400", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "Teszt", email: "", password: "Pass123" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain("E-mail");
    });
});
