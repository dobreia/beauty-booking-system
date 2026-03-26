import request from "supertest";
import app from "../src/server.js";

describe("Foglalás védelem", () => {
    test("Foglalás token nélkül -> átirányítás loginre", async () => {
        const res = await request(app)
            .post("/api/bookings")
            .send({ service_id: 1, employee_id: 1, start_time: new Date() });

        expect([302, 401, 403]).toContain(res.statusCode);
    });
});
