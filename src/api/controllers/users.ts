import express from "express";
import mongoose from "mongoose";
// For password Encryption and Hashing
import bcrypt from "bcrypt";
// For generating Token
import jwt from "jsonwebtoken";
import {User} from "../models/users";


export class UserController{

    getAllUsers(req:express.Request,res:express.Response,next:express.NextFunction){

        User.find()
            .select("_id email role")
            .then((data)=>{
                if(data.length>0){
                    res.status(200).json({
                        "Number of Users":data.length,
                        "Data": data  
                    });
                }
                else{
                    res.status(404).json({
                        message:"No users found"
                    })
                }
            })
            .catch((err)=>{
                //console.log(err);
                res.status(500).json({message : err});
            })
    }


    signUpUser(req:express.Request,res:express.Response,next:express.NextFunction){

        // We only want to register a user with new email id
        // If email already exists then return email already registered
        User.find({email: req.body.email})
        .then((data)=>{
            if(data.length>=1){
                return res.status(422).json({
                    message: "User already exists"
                })
            }
            else{
                // This 10 here indicated salting
                // This means we are going to add random string to our password 
                // So that hashed password can't be decoded 
                // this 10 is the salt
                // Thus this adding of random string is called Salting
                bcrypt.hash(req.body.password, 10, (err,hash)=>{
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then((data)=>{
                                console.log(data);
                                res.status(201).json({
                                    message: "User successfully Signed Up"
                                });
                            })
                            .catch((err)=>{
                                //console.log(err);
                                res.status(500).json({message : err});
                            });
                    }
                });
            }
        })  
    }


    logInUser(req:express.Request,res:express.Response,next:express.NextFunction){

        User.find({email: req.body.email})
            .then((user)=>{
                if(user.length<1){
                    res.status(401).json({message: "Authorization Error: Either Email or Password is wrong"});
                }
                else{
                    bcrypt.compare(req.body.password, <string>(user[0].password as unknown))
                        .then((data)=>{
                            if(data){
                                const token=jwt.sign({
                                                email: user[0].email,
                                                userId: user[0]._id 
                                                }, 
                                                "secret",
                                                {
                                                    expiresIn:"1h"
                                                }
                                            );
                                res.status(200).json({
                                    message: "Log In Successful",
                                    token: token
                                })
                            }
                            else{
                                res.status(401).json({message: "Authorization Error: Either Email or Password is wrong"});
                            }
                        })
                        .catch((err)=>{
                            res.status(401).json({message: "Authorization Error: Either Email or Password is wrong"});
                        })   
                }    
            })
            .catch((err)=>{
                res.status(500).json({message : err});
                //console.log(err);
            });
    }


    deleteUser(req:express.Request,res:express.Response,next:express.NextFunction){

        User.findByIdAndDelete(req.params.userId)
            .select("_id email")
            .then((data)=>{
                if(data){
                    res.status(200).json({
                        message: "User succesfully Deleted",
                        Account: data
                    })
                }
                else{
                    res.status(404).json({message: "No User found for the given Id"});
                }
            })
            .catch((err)=>{
                res.status(500).json({message : err});
                //console.log(err);
            })
    }

    
}