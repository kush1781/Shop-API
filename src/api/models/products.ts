import mongoose from "mongoose";

export {Product}

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required: true
    }, 
    price:{
        type: Number,
        required: true,
    },
    productImage: {
        type: String
    }
});

// This to remove the error code:101
export interface ProductDoc extends mongoose.Document {
    name:{
        type: String,
        required: true
    }, 
    price:{
        type: Number,
        required: true,
    },
    productImage: {
        type: String
    }
}

var Product = mongoose.model<ProductDoc>("Product1",productSchema);