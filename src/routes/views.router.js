import { Router } from "express";
import ProductModel from "../models/product.model.js";
import CartManager from "../managers/cart-manager.js";

const router = Router();
const manager = new CartManager();

router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc', query = '' } = req.query;

    try {
        const productos = await ProductModel.paginate(
            {
                $or: [
                    { title: { $regex: query, $options: 'i' } }, // Filtro por nombre
                    { category: { $regex: query, $options: 'i' } } // Filtro por categoría
                ]
            },
            {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: sort === 'asc' ? 1 : -1 }, // Ordenación por precio
            }
        );

        res.render("home", {
            productos: productos.docs,
            currentPage: productos.page,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            limit: productos.limit,
            query,
        });
    } catch (error) {
        res.status(500).send("Error al recuperar los productos");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await ProductModel.find().lean();
        res.render("realtimeproducts", { productos });
    } catch (error) {
        res.status(500).send("Error al recuperar los productos");
    }
});

router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = await ProductModel.findById(pid).lean();
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render("productDetail", { producto });
    } catch (error) {
        res.status(500).send("Error al obtener el producto");
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const carrito = await manager.getCarritoById(cid); 
    } catch (error) {
        res.status(500).send("Error al obtener el carrito");
    }
});

export default router;
