import ProductManager from "./ProductManager.js";
import CartModel from "../models/cart.model.js";

class CartManager {
    constructor() {
        this.productManager = new ProductManager(); 
    }

    async crearCarrito() {
        try {
            const newCart = { products: [] }; 
            const carritoCreado = await CartModel.create(newCart); 
            return carritoCreado;
        } catch (error) {
            console.error("Error al crear carrito:", error);
            throw error;
        }
    }

    async getCarritoById(carritoId) {
        try {
            const carrito = await CartModel.findById(carritoId).populate("products.product"); 
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener carrito:", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const productoExistente = carrito.products.find(
                (item) => item.product._id.toString() === productoId
            );

            if (productoExistente) {
                productoExistente.quantity += quantity; 
            } else {
                carrito.products.push({ product: productoId, quantity }); 
            }

            await carrito.save(); 
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(carritoId, productoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            carrito.products = carrito.products.filter(
                (item) => item.product._id.toString() !== productoId
            );
            await carrito.save(); 
            return carrito;
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }

    async actualizarCantidadProductoEnCarrito(carritoId, productoId, cantidad) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const producto = carrito.products.find(
                (item) => item.product._id.toString() === productoId
            );

            if (producto) {
                producto.quantity = cantidad; 
            }

            await carrito.save(); 
            return carrito;
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            throw error;
        }
    }

    async eliminarTodosProductosDelCarrito(carritoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            carrito.products = []; 
            await carrito.save(); 
            return carrito;
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            throw error;
        }
    }
}

export default CartManager;
