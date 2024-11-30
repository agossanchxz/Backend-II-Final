import ProductModel from '../models/product.model.js'; 

class ProductManager {
    async addProduct({ title, description, price, code, stock, category }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            const existingProduct = await ProductModel.findOne({ code });
            if (existingProduct) {
                throw new Error("El código del producto ya existe");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                code,
                stock,
                category
            });

            await newProduct.save();
            console.log("Producto añadido:", newProduct);
            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw error;
        }
    }


    async getProducts({ page = 1, limit = 10, sort = 'asc', category, available }) {
        try {
            const query = {};
            if (category) query.category = category;
            if (available !== undefined) query.stock = { $gt: 0 }; // Filtrar productos disponibles

            const products = await ProductModel.paginate(query, {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { price: sort === 'asc' ? 1 : -1 }
            });

            return products; 
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            console.log("Producto actualizado:", product);
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            console.log("Producto eliminado");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }
}

export default ProductManager;
