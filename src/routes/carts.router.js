import express from 'express';
import CartManager from '../managers/cart-manager.js';

const router = express.Router();
const cartManager = new CartManager('carts.json');

router.post('/', async (req, res) => {
    const newCart = { products: [] };
    await cartManager.addCart(newCart);
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = await cartManager.getCartById(cartId);
    
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    
    const productIndex = cart.products.findIndex(p => p.product === productId);
    
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }

    await cartManager.saveCarts();
    res.status(201).json(cart);
});

export default router;
