import { Router } from "express";
import CartManager from "../managers/cart-manager.js";
import ProductManager from "../managers/product-manager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.status(201).json({ status: 'success', payload: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


router.get("/:cid", async (req, res) => {
    try {
        const carrito = await cartManager.getCarritoById(parseInt(req.params.cid));
        res.json({ status: 'success', payload: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const carrito = await cartManager.eliminarProductoDelCarrito(parseInt(req.params.cid), parseInt(req.params.pid));
        res.json({ status: 'success', payload: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


router.put("/:cid", async (req, res) => {
    try {
        const productos = req.body.products;  
        if (!Array.isArray(productos)) {
            return res.status(400).json({ status: 'error', message: 'Debe enviar un arreglo de productos' });
        }
        const carrito = await cartManager.actualizarCarrito(parseInt(req.params.cid), productos);
        res.json({ status: 'success', payload: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo' });
        }
        const carrito = await cartManager.actualizarCantidadProductoEnCarrito(parseInt(req.params.cid), parseInt(req.params.pid), quantity);
        res.json({ status: 'success', payload: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const carrito = await cartManager.eliminarTodosProductosDelCarrito(parseInt(req.params.cid));
        res.json({ status: 'success', payload: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
