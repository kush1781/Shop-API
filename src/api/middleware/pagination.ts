import express from "express";

export function pagination(req:express.Request,res:express.Response,next:express.NextFunction){

    // two below lines are just to prevent the errors
    // the code is fucked due to this file 
    // so we will skip this file
    // and come back to it later
    var data = req.body;
    var formattedData = req.body

    // Adding pagination using queries 
    const page = <number>(req.query.page as unknown);
    const limit = <number>(req.query.limit as unknown);

    const startIndex = (page-1)*limit | 0;
    const endIndex =  page*limit | 0;

    const slicedData = formattedData.slice(startIndex,endIndex);

    const response : any= {}

    if(page>Math.ceil(data.length*1.0/limit))
    {
        response.Message = "Page No selected is wrong, thus showing all the products"
    }
    response["Total Count"] = data.length,
    response["Page Count"] = slicedData.length>0?slicedData.length:formattedData.length,
    response["Products"] = slicedData.length>0?slicedData:formattedData

} 