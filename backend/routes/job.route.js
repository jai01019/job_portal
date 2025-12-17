import { createJob,getJobById,getAdminJobs,getAllJobs } from '../controllers/job.controller.js'
import isAuthenticate from '../middleware/isAuthenticated.js'
import express from 'express'
const router=express.Router();

router.post("/createJob",isAuthenticate,createJob);
router.get("/getJobById/:id",isAuthenticate,getJobById);
router.get("/getAdminJobs",isAuthenticate,getAdminJobs);
router.get("/getAllJobs",isAuthenticate,getAllJobs);
 
export default router;