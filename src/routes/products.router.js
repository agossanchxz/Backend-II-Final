import { Router } from "express";
import ProductModel from "../models/product.model.js";

const router = Router();

router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc', query = '' } = req.query;

    try {
        const productos = await ProductModel.paginate(
            {
                $or: [
                    { category: { $regex: query, $options: 'i' } },  // Filtro por categoría
                    { availability: query === 'available' ? true : { $exists: true } }  // Filtro por disponibilidad
                ]
            },
            {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: sort === 'asc' ? 1 : -1 },
            }
        );

        res.json({
            status: "success",
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).send("Error al obtener productos");
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const productoBuscado = await ProductModel.findById(id);
        if (!productoBuscado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(productoBuscado);
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, code, stock, category, status, availability } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ message: "Completar todos los campos" });
    }

    try {
        const newProduct = new ProductModel({ title, description, price, code, stock, category, status, availability });
        await newProduct.save();
        res.status(201).json({ message: "Producto agregado", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto actualizado", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
});

export default router;