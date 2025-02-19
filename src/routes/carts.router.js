import { Router } from "express";
import CartManager from "../managers/cart-manager.js";
import CartModel from "../models/cart.model.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] });
        res.status(201).json({ cartId: newCart._id });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const carrito = await CartModel.findById(req.params.cid).populate("products.product");
        if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

        let totalPrice = 0;
        carrito.products.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });
        carrito.totalPrice = totalPrice;

        res.render("cartDetail", { carrito });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.post("/:cid/add", async (req, res) => {
    const { productId } = req.body;
    try {
        const carrito = await cartManager.addProductToCart(req.params.cid, productId);
        res.json({ success: true, carrito });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const carrito = await cartManager.eliminarProductoDelCarrito(cid, pid);
        res.json({ status: "success", payload: carrito });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ status: "error", message: "La cantidad debe ser un número positivo" });
    }

    try {
        const carrito = await cartManager.actualizarCantidadProductoEnCarrito(req.params.cid, req.params.pid, quantity);
        res.json({ status: "success", payload: carrito });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const carrito = await cartManager.eliminarTodosProductosDelCarrito(req.params.cid);
        res.json({ status: "success", payload: carrito });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;