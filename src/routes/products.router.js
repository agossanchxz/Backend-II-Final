import express from 'express';
import ProductController from '../controllers/productController.js';
import passport from 'passport';
import { authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const productController = new ProductController();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', query = '' } = req.query;
        const products = await productController.getProducts({ page, limit, sort, query });

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), authorizeAdmin, async (req, res) => {
    try {
        const newProduct = await productController.createProduct(req.body);
        res.status(201).json({ message: "Producto agregado", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto", error: error.message });
    }
});

router.put('/:id', passport.authenticate('jwt', { session: false }), authorizeAdmin, async (req, res) => {
    try {
        const updatedProduct = await productController.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), authorizeAdmin, async (req, res) => {
    try {
        const deletedProduct = await productController.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
});

export default router;
