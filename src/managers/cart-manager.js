import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ProductManager from "./ProductManager.js";  

class CartManager {
    constructor(filePath) {
        const __filename = fileURLToPath(import.meta.url);
        const _dirname = dirname(__filename);
        this.path = join(_dirname, '../data/carts.json');  
        this.carts = [];
        this.ultId = 0;
        this.productManager = new ProductManager();  // Instancia del ProductManager
        this.cargarCarritos();  
    }

    async cargarCarritos() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos:", error);
            await this.guardarCarritos();  
        }
    }

    async guardarCarritos() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(nuevoCarrito);
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(carritoId) {
        try {
            const carritoBuscado = this.carts.find(carrito => carrito.id === carritoId);
            if (!carritoBuscado) {
                throw new Error("Carrito no encontrado");
            }

            
            const carritoConProductos = await this.populateProducts(carritoBuscado);
            return carritoConProductos;
        } catch (error) {
            console.log("Error al obtener el carrito por ID:", error);
            throw error;
        }
    }

    async populateProducts(carrito) {
      
        const productosCompletos = await Promise.all(
            carrito.products.map(async (item) => {
                const product = await this.productManager.getProductById(item.product);
                return { ...item, product: product };
            })
        );
        return { ...carrito, products: productosCompletos };
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product.id === productoId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }

    async eliminarProductoDelCarrito(carritoId, productoId) {
        const carrito = await this.getCarritoById(carritoId);
        carrito.products = carrito.products.filter(p => p.product.id !== productoId);

        await this.guardarCarritos();
        return carrito;
    }

    async actualizarCantidadProductoEnCarrito(carritoId, productoId, cantidad) {
        const carrito = await this.getCarritoById(carritoId);
        const producto = carrito.products.find(p => p.product.id === productoId);

        if (producto) {
            producto.quantity = cantidad;
        }

        await this.guardarCarritos();
        return carrito;
    }

    async actualizarCarrito(carritoId, productos) {
        const carrito = await this.getCarritoById(carritoId);
        carrito.products = productos;

        await this.guardarCarritos();
        return carrito;
    }

    async eliminarTodosProductosDelCarrito(carritoId) {
        const carrito = await this.getCarritoById(carritoId);
        carrito.products = [];

        await this.guardarCarritos();
        return carrito;
    }
}

export default CartManager;
