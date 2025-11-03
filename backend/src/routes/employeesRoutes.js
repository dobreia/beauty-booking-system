import express from "express";
import EmployeesController from "../controllers/EmployeesController.js";

const router = express.Router();

// GET all employees
router.get("/", async (req, res) => {
    try {
        res.json(await EmployeesController.getAll());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST new employee
router.post("/", async (req, res) => {
    try {
        res.status(201).json(await EmployeesController.create(req.body));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT update employee
router.put("/:id", async (req, res) => {
    try {
        res.json(await EmployeesController.update(req.params.id, req.body));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
    try {
        res.json(await EmployeesController.delete(req.params.id));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
