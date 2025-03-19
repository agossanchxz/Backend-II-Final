import jwt from 'jsonwebtoken';
import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(403).json({ message: 'No se encontró el token. Acceso denegado.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }
        req.user = user;
        next();
    });
};

export const initializePassport = () => {
    console.warn("initializePassport() no configura estrategias. Asegúrate de definirlas en otro archivo.");
    return passport.initialize();
};

export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: Se requiere rol de administrador.' });
    }
    next();
};