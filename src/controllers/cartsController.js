import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Ticket from '../models/ticketModel.js';

class CartController {
  handleErrorResponse(res, message, error, statusCode = 500) {
    console.error(message, error);
    return res.status(statusCode).json({ message, error: error.message || error });
  }

  async addProductToCart(req, res) {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'La cantidad debe ser un número positivo' });
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente para la cantidad solicitada' });
      }

      let cart = await Cart.findOneAndUpdate(
        { user: userId, 'products.product': productId },
        { $inc: { 'products.$.quantity': quantity } },
        { new: true }
      );

      if (!cart) {
        cart = await Cart.findOneAndUpdate(
          { user: userId },
          { $push: { products: { product: productId, quantity } } },
          { new: true, upsert: true }
        );
      }

      res.status(200).json({ message: 'Producto añadido al carrito', cart });
    } catch (error) {
      this.handleErrorResponse(res, 'Error añadiendo producto al carrito:', error);
    }
  }

  async purchaseCart(req, res) {
    const cartId = req.params.cid;
    const userId = req.user.id;

    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      let totalAmount = 0;
      const productsPurchased = [];
      const productsNotPurchased = [];

      for (const item of cart.products) {
        const product = item.product;
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          totalAmount += product.price * item.quantity;
          await product.save();
          productsPurchased.push(item);
        } else {
          productsNotPurchased.push({ productId: product._id, availableStock: product.stock });
        }
      }

      if (productsPurchased.length === 0) {
        return res.status(400).json({
          message: 'No se pudo realizar la compra. Stock insuficiente en todos los productos.',
          productsNotPurchased
        });
      }

      cart.products = cart.products.filter(item => productsNotPurchased.some(p => p.productId.equals(item.product._id)));
      await cart.save();

      const ticket = await Ticket.create({
        amount: totalAmount,
        purchaser: req.user.email
      });

      res.status(200).json({
        message: 'Compra realizada con éxito',
        ticket,
        productsNotPurchased
      });
    } catch (error) {
      this.handleErrorResponse(res, 'Error finalizando la compra:', error);
    }
  }
}

export default CartController;
