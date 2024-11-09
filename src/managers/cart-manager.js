import fs from "fs"; 

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;
    }

    async initialize() {
        await this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            
            this.carts = [];
            this.ultId = 0;
            await this.saveCarts();
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
        }
    }

    async createCart() {
        const newCart = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCarts() {
        return this.carts;
    }

    async getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error("No existe un carrito con ese id");
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

export default CartManager;