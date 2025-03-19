import express from 'express';
import UserController from '../controllers/userController.js';
import passport from 'passport';

const router = express.Router();
const userController = new UserController();

router.post('/register', async (req, res) => {
    try {
        await userController.register(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        await userController.login(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
    }
});

router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await userController.currentUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Sesión cerrada correctamente' });
});

export default router;
