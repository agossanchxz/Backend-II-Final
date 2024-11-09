import fs from "fs/promises"; 

class ProductManager {
    static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;

        this.loadArray(); 
    }

    async loadArray() {
        try {
            this.products = await this.readFile();
            ProductManager.lastId = this.products.length ? Math.max(...this.products.map(p => p.id)) : 0;
        } catch (error) {
            console.error("Error interno:", error);
        }
    }

    async addProduct({ title, description, price, code, stock, category }) {
        if (!title || !description || !price || !code || !stock || !category) {
            console.log("Debes completar todos los campos para continuar");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }

        const newProduct = {
            id: ++ProductManager.lastId, 
            title,
            description,
            price,
            code,
            stock,
            category,  // Agregamos el campo category
        };

        this.products.push(newProduct);
        await this.saveFile(this.products);
        console.log("Producto Añadido:", newProduct);
    }

    async getProducts({ page = 1, limit = 10, sort = 'asc', category, available }) {
        try {
            // Filtrar por categoría, si se proporciona
            let filteredProducts = this.products;

            if (category) {
                filteredProducts = filteredProducts.filter(p => p.category === category);
            }

            // Filtrar por disponibilidad, si se proporciona
            if (available !== undefined) {
                filteredProducts = filteredProducts.filter(p => p.stock > 0 === available);
            }

            // Ordenar por precio (ascendente o descendente)
            if (sort === 'desc') {
                filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
            } else {
                filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
            }

            // Paginación: Obtener solo los productos de la página solicitada
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedProducts = filteredProducts.slice(start, end);

            return paginatedProducts;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const foundProduct = this.products.find(item => item.id === id);

            if (!foundProduct) {
                console.log("No se encuentra disponible este producto");
                return null;
            }
            return foundProduct; 
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            return null;
        }
    }

    async readFile() {
        const response = await fs.readFile(this.path, "utf-8");
        return JSON.parse(response);
    }

    async saveFile(productArray) {
        await fs.writeFile(this.path, JSON.stringify(productArray, null, 2));
    }

    async updateProduct(id, updatedProduct) {
        try {
            const index = this.products.findIndex(item => item.id === id); 

            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedProduct };
                await this.saveFile(this.products); 
                console.log("Producto actualizado:", this.products[index]);
            } else {
                console.log("No se encuentra este producto");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error); 
        }
    }

    async deleteProduct(id) {
        try {
            const index = this.products.findIndex(item => item.id === id); 

            if (index !== -1) {
                this.products.splice(index, 1); 
                await this.saveFile(this.products); 
                console.log("Producto eliminado");
            } else {
                console.log("No se encuentra este producto");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error); 
        }
    }
}

export default ProductManager;
