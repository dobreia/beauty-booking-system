import request from "supertest";
import app from "../src/server.js";

describe("Admin jogosultság", () => {
    test("Felhasználók listája token nélkül -> beléptetés szükséges", async () => {
        const res = await request(app).get("/api/users");

        // API biztonsági viselkedéstől függően 302 redirect vagy 401/403 error is elfogadott
        expect([302, 401, 403]).toContain(res.statusCode);
    });
});
