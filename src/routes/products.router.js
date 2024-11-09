import express from "express";
import ProductManager from "../managers/product-manager.js";

const manager = new ProductManager("./src/data/productos.json");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; 
        const page = parseInt(req.query.page) || 1;    
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null; 
        const query = req.query.query; 

        
        const productos = await manager.getProducts();

        
        let filteredProducts = productos;
        if (query) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === query ||
                (query === 'disponible' && product.stock > 0) 
            );
        }

        if (sort) {
            filteredProducts.sort((a, b) => (a.price - b.price) * sort); 
        }

        const totalProducts = filteredProducts.length; 
        const totalPages = Math.ceil(totalProducts / limit); 
        const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit); 

       
        res.json({
            status: "success",
            payload: paginatedProducts,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null, 
            nextPage: page < totalPages ? page + 1 : null, 
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${req.query.sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${req.query.sort}&query=${query}` : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error interno del sistema" });
    }
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        const productoBuscado = await manager.getProductById(id);

        if (!productoBuscado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(productoBuscado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
});

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    if (!nuevoProducto.title || !nuevoProducto.price) {
        return res.status(400).json({ message: "Completar todos los campos" });
    }

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).json({ message: "Producto agregado", product: nuevoProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const productoActualizado = req.body;

    try {
        const productoExistente = await manager.getProductById(id);

        if (!productoExistente) {
            return res.status(404).json({ message: "Producto no se encuentra en el sistema" });
        }

        await manager.updateProduct(id, productoActualizado);
        res.json({ message: "Producto actualizado", product: productoActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        const productoEliminado = await manager.getProductById(id);

        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no se encuentra en el sistema" });
        }

        await manager.deleteProduct(id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
});

export default router;
