import express from "express";
// For checking the Token is valid or not
import {authCheck} from "../middleware/authorizations/check-auth";
import {OrderController} from "../controllers/orders";

export {router as orderRoutes};

const router = express.Router();
router.use(express.json());

const orderObj = new OrderController();

// **GET Request for /orders**
router.get("/", authCheck, orderObj.getAllOrders);

// **POST Request for /orders**
router.post("/", authCheck, orderObj.createOrder);

// **GET Request for /orders/{id}**
router.get("/:orderId", authCheck, orderObj.getOrderById);

// **DELETE Request for /orders/{id}**
router.delete("/:orderId", authCheck, orderObj.deleteById);