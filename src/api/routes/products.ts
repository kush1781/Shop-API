import express from "express"
// To parse foreign body like an image
import multer from "multer";
import {ProductController} from "../controllers/products"
// For checking the Token is valid or not
import {authCheck} from "../middleware/authorizations/check-auth";

export {router as productRoutes} 

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,"src/uploads/");
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-')+"_"+file.originalname);
    }
});
const fileFilter = (req:express.Request, file:Express.Multer.File, cb:multer.FileFilterCallback)=>{
    // accept the file
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png")
        cb(null,true);
    // reject the file
    else
        cb(new Error("Can't save this file, can only save .jpeg or .png files"));    
}
const upload = multer({
    storage:storage, 
    limits:{
    fileSize: 1024*1024*5 // accept files upto 5MB only
    },
    fileFilter:fileFilter
});

// For JSON Encoding
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const productObj = new ProductController();

// **GET Request for /products**
router.get("/", productObj.getAllProducts);

// **POST Request for /products**
router.post("/", authCheck, upload.single("productImage"), productObj.createProduct);

// **GET Request for /products/{id}**
router.get("/:productId", productObj.getProductById);

// **PUT Request for /products/{id}**
router.put("/:productId", authCheck, productObj.updateProductById);

// **DELETE Request for /products/{id}**
router.delete("/:productId", authCheck, productObj.deleteProductById);