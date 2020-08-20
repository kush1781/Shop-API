export {app}; 

import express from "express";
// Logging Package-To log incoming requests, to get the info about them in the terminal
// eg: like this, GET /products 200 3.284 ms - 48
// actually morgan call the next thing in our router.get("/", (req,res,next)=>{}
// and console.log(), some details about the request made
import morgan from "morgan";
import mongoose from "mongoose";
import * as _ from "dotenv";
import cors from "cors";
import {productRoutes} from "./api/routes/products";
import {orderRoutes} from "./api/routes/orders";
import {userRoutes} from "./api/routes/users";

_.config();
const app = express();

// **Middlewares**

app.use(morgan("dev"));
// To handle to view image on localhost
app.use("/src/uploads",express.static("src/uploads"));
// Something added later guess does the same thing as below
app.use(cors())
// To disable cors() errors
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-type, Accept, Authorization"
        );
    if(req.method==="OPTIONS"){
        res.header("Access-Control-Allow-Method", "GET, POST, PUT, DELETE");
        return  res.status(200).json({});
    }
    next();    
});
// Routes which should handle requests
//app.use("/api/products",productRoutes);
//app.use("/api/orders",orderRoutes);
//app.use("/api/users",userRoutes);
app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/users",userRoutes);

//Handling the errors
class Err extends Error{
    constructor(message:string)
    {
        super(message);
    }
    status?:number;
}
app.use((req,res,next)=>{
    const error = new Err("Not Found");
    error.status=404; 
    next(error);
})
app.use((error:Err,req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.status(error.status||500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});


// Connect to the Database
if(!process.env.password || !process.env.dbname || !process.env.user){
    console.error("Environment variables like user, password or dbanme are missing");
    process.exit(1);
}

const user = process.env.user
const password = process.env.password
const dbname = process.env.dbname
const db = `mongodb+srv://${user}:${password}@cluster0-jzsuf.mongodb.net/${dbname}?retryWrites=true&w=majority`
mongoose.connect(db,
                { useNewUrlParser: true,
                useUnifiedTopology: true })
                .then(()=>{
                    console.log("Connected to DB...")
                })
                .catch((err)=>{
                    console.log(err);
                });            
