import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/api/sessions.js";
import userRouter from "./routes/user.routes.js";

import { adminAuthorization, userAuthorization } from "./middlewares/auth.middleware.js";
import UserDAO from "./dao/userDAO.js";
import UserDTO from "./dto/userDTO.js";

import CartModel from "./models/cart.model.js";
import TicketModel from "./models/ticketModel.js";
import ProductModel from "./models/product.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

const userDAO = new UserDAO();

app.use(session({
    secret: process.env.JWT_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);

app.get("/api/users/current", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await userDAO.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const userDTO = new UserDTO(user);
        res.json(userDTO);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo el usuario" });
    }
});

app.post("/api/carts/:cid/purchase", userAuthorization, async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate("items.productId");
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        let totalAmount = 0;
        const productsToPurchase = [];
        const productsNotPurchased = [];

        for (const item of cart.items) {
            const product = item.productId;
            if (!product) continue;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
                productsToPurchase.push(item);
            } else {
                productsNotPurchased.push(item.productId._id);
            }
        }

        const ticket = await TicketModel.create({
            code: generateUniqueCode(),
            amount: totalAmount,
            purchaser: req.user.email
        });

        cart.items = cart.items.filter(item => productsNotPurchased.includes(item.productId._id));
        await cart.save();

        res.json({ ticket, notPurchasedProducts: productsNotPurchased });
    } catch (error) {
        res.status(500).json({ error: "Error procesando la compra", details: error.message });
    }
});

function generateUniqueCode() {
    return "TICKET-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");
});
