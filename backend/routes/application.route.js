import { createApplication,getAppliedJobs,getApplicants,updateAppicationStatus} from '../controllers/application.controller.js'

import express  from "express"
import isAuthenticate from '../middleware/isAuthenticated.js';
const router =express.Router();


router.post("/createApplication/:jobId",isAuthenticate,createApplication);
router.get("/getAppliedJobs",isAuthenticate,getAppliedJobs);
router.get("/getApplicants/:jobId",isAuthenticate,getApplicants);
router.put("/updateAppicationStatus/:id",isAuthenticate,updateAppicationStatus);

export default router   