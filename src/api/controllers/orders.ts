import express from "express";
import mongoose from "mongoose";
import {Order} from "../models/orders";
import {Product} from "../models/products";

export class OrderController{

    getAllOrders(req:express.Request,res:express.Response,next:express.NextFunction){

        Order.find()
            .select("_id productId quantity")
            .populate("productId", "_id name price")
            .then((data)=>{
            res.status(200).json({
                count: data.length,
                orders: data.map((data)=>{
                        return {
                            _id: data._id,
                            productId: data.productId,
                            quantity: data.quantity,
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/orders/"+data._id
                            } 
                        }
                })
                })
            })
            .catch((err)=>{
            res.status(500).json({message : err});
            console.log(err);
            })
    }


    createOrder(req:express.Request,res:express.Response,next:express.NextFunction){
    
        Product.findById(req.body.productId)
                .then((product)=>{
                    if(!product){
                            res.status(404).json({
                            message: "Product not found"
                        });
                    };
                    const order = new Order({
                        _id: mongoose.Types.ObjectId(),
                        quantity: req.body.quantity,
                        productId: req.body.productId
                    });
                    return order.save();
                })
                .then((data)=>{
                        res.status(201).json({
                            message : "Order Stored",
                            Order: {
                                _id: data._id,
                                productId: data.productId,
                                quantity: data.quantity
                            },
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/orders/"+ data._id
                            }
                        })
                    })
                    .catch((err)=>{
                        res.status(500).json({message : err});
                        console.log(err);
                    })        
    }


    getOrderById(req:express.Request,res:express.Response,next:express.NextFunction){

        const id = req.params.orderId;
        Order.findById(id)
            .select("_id productId quantity")
            .populate("productId", "_id name price")
            .then((data)=>{
                if(!data)
                {
                    return res.status(404).json({
                        message: "Order not Found"
                    })
                }
                res.status(200).json({
                    order: {
                        _id: data._id,
                        productId: data.productId,
                        quantity: data.quantity
                    },
                    request: {
                        type: "GET",
                        description:"GET all the orders details",
                        url: "http://localhost:3000/orders"
                    }
                })
            })
            .catch((err)=>{
                res.status(500).json({message : err});
                console.log(err);
            })
    }


    deleteById(req:express.Request,res:express.Response,next:express.NextFunction){
    
        const id = req.params.orderId;
        Order.findByIdAndRemove(id)
            .select("_id productId quantity")
            .then((data)=>{
                if(!data)
                {
                    return res.status(404).json({
                        message: "Order not Found"
                    })
                }
                res.status(200).json({
                    message: "Order deleted",
                    order: {
                        _id: data._id,
                        productId: data.productId,
                        quantity: data.quantity
                    },
                    request: {
                        type: "POST",
                        description:"Create an order",
                        body: {productId:"ID" , quantity:"Number"},
                        url: "http://localhost:3000/orders"
                    }
                })
            })
            .catch((err)=>{
                res.status(500).json({message : err});
                console.log(err);
            })
    }
    
}