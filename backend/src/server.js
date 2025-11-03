import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingsRoutes from "./routes/bookingsRoutes.js";
import employeesRoutes from "./routes/employeesRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
