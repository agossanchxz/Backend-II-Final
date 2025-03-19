import express from 'express';
import UserController from '../controllers/userController.js'; // Sin llaves {} porque es una exportación default
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();
const userController = new UserController();

router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.get('/current', authenticateJWT, userController.getCurrentUser.bind(userController));

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Sesión cerrada correctamente' });
});

export default router;
