import {registerCompany,getCompany,getCompanyById,updateCompany} from "../controllers/company.controller.js";
import exppress from "express";
import isAuthenticate from "../middleware/isAuthenticated.js";
const router=exppress.Router();
router.post("/register",isAuthenticate,registerCompany);
router.get("/getcompany",isAuthenticate,getCompany);
router.get("/getcompanyById/:id",isAuthenticate,getCompanyById);
router.put("/updatecompany/:id",isAuthenticate,updateCompany);

export default router   