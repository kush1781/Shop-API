import mongoose from "mongoose";

export {Order};

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : "Product1",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

// This to remove the error code:101
export interface OrderDoc extends mongoose.Document {
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : "Product1",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}

var Order = mongoose.model<OrderDoc>("Order",orderSchema);