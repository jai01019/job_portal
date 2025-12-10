import { registerUser,login,logOut,update } from "../controllers/user.controller.js";
import isAuthenticate from "../middleware/isAuthenticated.js";
import express from "express";
const router=express.Router();

router.post("/register",registerUser);
router.post("/login",login);
router.post("/logout",isAuthenticate,logOut);
router.put("/profile/update",isAuthenticate,update)

export default router