import { Router } from 'express';
const r = Router();

r.get("/", (req, res) => {
    res.json({ message: "Auth route is working!" });
});

export default r;