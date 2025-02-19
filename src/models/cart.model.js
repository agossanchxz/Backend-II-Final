import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", 
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1 
            }
        }
    ]
});

cartSchema.pre(["find", "findOne"], function(next) {
    this.populate("products.product");  
    next();
});

cartSchema.methods.addProduct = async function(productId, quantity = 1) {
    const productIndex = this.products.findIndex(
        item => item.product.toString() === productId
    );
    if (productIndex >= 0) {
        this.products[productIndex].quantity += quantity; 
    } else {
        this.products.push({ product: productId, quantity }); 
    }
    await this.save();
};

cartSchema.methods.removeProduct = async function(productId) {
    this.products = this.products.filter(
        item => item.product.toString() !== productId
    );
    await this.save();
};

cartSchema.statics.createCart = async function() {
    const cart = new this({ products: [] }); 
    await cart.save();
    return cart;
};

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;