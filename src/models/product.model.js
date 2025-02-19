import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,  
    },
    description: {
        type: String,
        required: true, 
    },
    price: {
        type: Number,
        required: true, 
        min: 0,         
    },
    img: {
        type: String,
        default: "sin imagen",
    },
    code: {
        type: String,
        required: true,
        unique: true,  
    },
    stock: {
        type: Number,
        required: true,  
        min: 0,         
    },
    category: {
        type: String,
        required: true,  
    },
    status: {
        type: Boolean,
        default: true,  
    },
    thumbnails: {
        type: [String], 
    },
    availability: {
        type: Boolean,
        required: true, 
        default: true,  
    },
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;