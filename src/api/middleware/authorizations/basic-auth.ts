// import express from "express";

// export function authBasic(req:express.Request, res:express.Response, next:express.NextFunction){

//     if(req.user == null){
//         return res.status(403).json("You need to SignUp or LogIn");
//     }
//     next();
// }

// export function authRole(role){
//     return (req:express.Request, res:express.Response, next:express.NextFunction)=>{

//         if(req.user.role !== role){
//             return res.status(401).json("Not Accesaable for",req.user.role);
//         }
//         next();
//     }
// }
