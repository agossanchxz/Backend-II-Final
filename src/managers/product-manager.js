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

    async addProduct({ title, description, price, code, stock }) {
        if (!title || !description || !price || !code || !img || !stock) {
            console.log("Debes completar todos los campos para continuar");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: ++ProductManager.lastId, 
            title,
            description,
            price,
            code,
            stock
        };

        this.products.push(newProduct);
        await this.saveFile(this.products);
        console.log("Producto Añadido:", newProduct);
    }

    async getProducts() {
        try {
            return await this.readFile(); 
        } catch (error) {
            console.error("Error al leer la archivo", error); 
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
            console.log("No se encuentra este producto", foundProduct); 
            return foundProduct; 
        } catch (error) {
            console.error("Error no se encuentra el ID disponible", error); 
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
                console.log("Este producto se encuentra disponible", this.products[index]); 
            } else {
                console.log("No se encuentra este producto"); 
            }
        } catch (error) {
            console.error("Error al acutalizar este prodcuto", error); 
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
            console.error("Error al elimiar el producto", error); 
        }
    }
}

export default ProductManager;
