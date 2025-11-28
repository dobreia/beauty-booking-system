import jwt from "jsonwebtoken";

// Secret key for JWT token verification
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Middleware to ensure authentication
export function authRequired(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if there is an Authorization header
    if (!authHeader) {
        return res.redirect('/login'); // Redirect to login if no token is provided
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Assuming 'Bearer <token>'

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login'); // Redirect to login if the token is invalid
        }
        req.user = user; // Attach user info to request object
        next();
    });
}

// Middleware to ensure admin privileges
export function adminRequired(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
}
