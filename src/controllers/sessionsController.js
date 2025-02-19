import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "El usuario ya existe" });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: "user"
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", details: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "fallback-secret",
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true });
        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ error: "Error en el login", details: error.message });
    }
};

export const getCurrentUser = (req, res) => {
    res.json({ user: req.user });
};
