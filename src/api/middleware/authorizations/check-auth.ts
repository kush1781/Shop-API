import express from "express";
import jwt from "jsonwebtoken";


export function authCheck(req:express.Request,res:express.Response,next:express.NextFunction){
    try{
        const token = (req.headers.authorization as string).split(" ")[1];
        // console.log(token);
        // Why we did this is
        // https://www.youtube.com/watch?v=8Ip0pcwbWYM&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=13
        // 12:30
        //const decoded = jwt.verify(req.body.token, "secret");
        const decoded = jwt.verify(token, "secret");
        //req.userData = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Auth failed, Token is not valid or has expired"
        })
    }
}