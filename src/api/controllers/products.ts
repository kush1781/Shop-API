import express from "express";
import mongoose from "mongoose";
import {Product} from "../models/products";


export class ProductController{

    getAllProducts(req:express.Request,res:express.Response,next:express.NextFunction){

        Product.find()
                .select("name price _id productImage")
                .then((data)=>{
                    if(data.length>0){

                        // Adding pagination using queries 
                        const page = <number>(req.query.page as unknown);
                        const limit = <number>(req.query.limit as unknown);

                        const startIndex = (page-1)*limit | 0;
                        const endIndex =  page*limit | 0;

                        var formattedData = data.map((data)=>{
                            return {
                                // error 101: solved by using interface in models/products
                                name: data.name,
                                price: data.price,
                                productImage: data.productImage,
                                _id: data._id,
                                url: {
                                    type:"GET",
                                    url: "http://localhost:3000/products/"+data._id
                                }
                            }
                        });

                        const slicedData = formattedData.slice(startIndex,endIndex);

                        const response : any= {}

                        if(page>Math.ceil(data.length*1.0/limit))
                        {
                            response.Message = "Page No selected is wrong, thus showing all the products"
                        }
                        response["Total Count"] = data.length,
                        response["Page Count"] = slicedData.length>0?slicedData.length:formattedData.length,
                        response["Products"] = slicedData.length>0?slicedData:formattedData
                        
                        res.status(200).json(response);
                    }
                    else{
                        res.status(404).json({message: "No enteries found"});
                    }
                })
                .catch((err)=>{
                    res.status(500).json({message : err});
                    console.log(err);
                });
        
    }


    createProduct(req:express.Request,res:express.Response,next:express.NextFunction){

        
        if(req.file!==undefined){
            console.log(req.file);
            var product = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path
            });
        }
        else{
            var product = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name, 
                price: req.body.price
            });
        }
        console.log(product)
        product.save()
                .then((data)=>{
                    res.status(201).json({
                        name: data.name,
                        price: data.price,
                        _id: data._id,
                        url: {
                            type:"GET",
                            url: "http://localhost:3000/products/"+data._id
                        }
                    });
                })
                .catch((err)=>{
                    //console.log(err);
                    res.status(500).json({message : err});
                });
    }


    getProductById(req:express.Request,res:express.Response,next:express.NextFunction){

        const id = req.params.productId;
        Product.findById(id)
                .select("name price _id productImage")
                .then((data)=>{
                    if(data){
                        res.status(200).json({
                            product: data,
                            url: {
                                type:"GET",
                                description:"To all the products",
                                url: "http://localhost:3000/products"
                            }
                        });
                    }
                    else{
                        res.status(404).json({message: "No valid entry found for the given Product Id"});
                    }
                })
                .catch((err)=>{
                    res.status(500).json({message : err});
                    //console.log(err);
                });
    }


    updateProductById(req:express.Request,res:express.Response,next:express.NextFunction){

        //console.log(req.file);
        console.log(req.body);
        const id = req.params.productId;

        // By this we can even Update some part of the data 
        // https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6
        // 34:00 mins
        // const updateOps = {};
        // for(var ops of req.body){
        //     updateOps[ops.propName] = ops.value;
        // }

        Product.findById(id)
                .select("name price")
                .then((data)=>{
                    if(data){
                        
                        let k:any = <object> data
                        // let product = {
                        //     name: req.body.name?req.body.name:k.name,
                        //     price: req.body.price?req.body.price:k.price
                        // };
                        let product:any={}; 
                        for(let key of Object.keys(k._doc)){
                            if(key=="_id")
                                continue;
                            product[key] = req.body[key]?req.body[key]:k[key];
                        }
                        
                        Product.findByIdAndUpdate(id,product)
                                .then((update)=>{
                                    res.status(200).json({
                                        "message":"values update from",
                                        "old":data,
                                        "new":product
                                    })
                                })
                                .catch((err)=>{
                                    res.status(500).json({message : err});
                                })
                        
                    }
                    else{
                        res.status(404).json({message: "No valid entry found for the given Product Id"});
                    }
                })
                .catch((err)=>{
                    res.status(500).json({message : err});
                    console.log(err);
                });
    }


    deleteProductById(req:express.Request,res:express.Response,next:express.NextFunction){

        const id = req.params.productId;
        Product.findByIdAndDelete(id)
                .select("name price _id productImage")
                .then((data)=>{
                    if(data){
                        res.status(200).json({
                            Deleted_Product: data,
                            url: {
                                type:"POST",
                                description:"Create a new product",
                                body: {name:"String" , price:"Number"},
                                url: "http://localhost:3000/products"
                            }
                        });
                    }
                    else{
                        res.status(404).json({message: "No valid entry found for the given Product Id"});
                    }
                })
                .catch((err)=>{
                    res.status(500).json({message : err});
                    //console.log(err);
                });
    }

    
}