import passport from "passport";
import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No autorizado, token no encontrado" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "fallback-secret", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }
        req.user = decoded; 
        next();
    });
};

export const passportJWTAuth = passport.authenticate("jwt", { session: false });