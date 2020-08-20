export {router as userRoutes};

import express from "express";
import {UserController} from "../controllers/users";
import {authCheck} from "../middleware/authorizations/check-auth";

const router = express.Router();

// For JSON Encoding
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const userObj = new UserController();

// **GET Request to SignUp User**
router.get("/", authCheck,userObj.getAllUsers);

// **POST Request to SignUp User**
router.post("/signup", userObj.signUpUser);

// **POST Request to LogIn User**
router.post("/login",userObj.logInUser);

// **DELETE Request to delete User**
router.delete("/:userId", authCheck,userObj.deleteUser)