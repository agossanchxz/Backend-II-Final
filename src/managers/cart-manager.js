import ProductManager from "./ProductManager.js";
<<<<<<< HEAD
import CartModel from "../models/cart.model.js"; 
=======
import CartModel from "../models/cart.model.js";
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060

class CartManager {
    constructor() {
        this.productManager = new ProductManager(); 
    }

    async crearCarrito() {
        try {
<<<<<<< HEAD
            const nuevoCarrito = { products: [] }; 
            const carritoCreado = await CartModel.create(nuevoCarrito); 
=======
            const newCart = { products: [] }; 
            const carritoCreado = await CartModel.create(newCart); 
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
            return carritoCreado;
        } catch (error) {
            console.error("Error al crear carrito:", error);
            throw error;
        }
    }

    async getCarritoById(carritoId) {
        try {
<<<<<<< HEAD
            const carrito = await CartModel.findById(carritoId).populate("products.product");
=======
            const carrito = await CartModel.findById(carritoId).populate("products.product"); 
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
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
<<<<<<< HEAD
=======
            } else {
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
                carrito.products.push({ product: productoId, quantity }); 
            }

            await carrito.save(); 
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error;
        }
    }

<<<<<<< HEAD
 
=======
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
    async eliminarProductoDelCarrito(carritoId, productoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            carrito.products = carrito.products.filter(
                (item) => item.product._id.toString() !== productoId
            );
<<<<<<< HEAD
            await carrito.save();
=======
            await carrito.save(); 
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
            return carrito;
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }

<<<<<<< HEAD

    async actualizarCantidadProductoEnCarrito(carritoId, productoId, cantidad) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const producto = carrito.products.find(
                (item) => item.product._id.toString() === productoId
            );

            if (producto) {
                producto.quantity = cantidad;
=======
    async actualizarCantidadProductoEnCarrito(carritoId, productoId, cantidad) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            const producto = carrito.products.find(
                (item) => item.product._id.toString() === productoId
            );

            if (producto) {
                producto.quantity = cantidad; 
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
            }

            await carrito.save(); 
            return carrito;
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            throw error;
        }
    }

<<<<<<< HEAD
    async actualizarCarrito(carritoId, productos) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            carrito.products = productos; 
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al actualizar carrito:", error);
            throw error;
        }
    }

=======
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
    async eliminarTodosProductosDelCarrito(carritoId) {
        try {
            const carrito = await this.getCarritoById(carritoId);
            carrito.products = []; 
<<<<<<< HEAD
            await carrito.save();
=======
            await carrito.save(); 
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
            return carrito;
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            throw error;
        }
    }
}

export default CartManager;
