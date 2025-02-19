import express from 'express';
import { hashPassword, comparePassword } from '../../utils/encrypt.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import User from '../../models/user.js';
import Cart from '../../models/cart.js';

dotenv.config();

const router = express.Router();

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = hashPassword(password);

    
        const newCart = new Cart({});
        await newCart.save();

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });

    } catch (error) {
        res.status(500).json({ error: 'Error registrando usuario', details: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('cart');

        if (!user || !comparePassword(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }).json({ message: 'Login exitoso', token });

    } catch (error) {
        res.status(500).json({ error: 'Error en el login', details: error.message });
    }
});

export default router;
