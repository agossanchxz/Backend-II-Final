import express from 'express';
import CartController from '../controllers/cartController.js';
import passport from 'passport';
import { authorizeUser } from '../middlewares/authMiddleware.js';

const router = express.Router();
const cartController = new CartController();


router.post('/', async (req, res) => {
    try {
        const newCart = await cartController.createCart();
        res.status(201).json({ cartId: newCart._id });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartController.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        let totalPrice = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        res.render("cartDetail", { cart, totalPrice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:cid/add', passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartController.addProductToCart(req.params.cid, productId, quantity);
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
    try {
        const cart = await cartController.removeProductFromCart(req.params.cid, req.params.pid);
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser un número positivo" });
    }

    try {
        const cart = await cartController.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:cid', passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
    try {
        const cart = await cartController.clearCart(req.params.cid);
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), authorizeUser, async (req, res) => {
    try {
        const result = await cartController.purchaseCart(req.params.cid, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
