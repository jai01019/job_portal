import Job from "../models/jobmodel.js"

export const createJob=(req,res)=>{

    try{
        const {title,description,salary,requirements,experienceLevel,location,jobType,position,companyId}=req.body;
        
           if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      !experienceLevel
    ) {
      return res.status(400).json({
        success: false,
        message: "Some required fields are missing"
      });
    }
    
        userId=req.id;
        if(!usedId){
            return res.status(400).json({
                success:false,
                message:"Required Field Is Missing"
            })
        }
    
    
         const newJob= new Job({
            title,
            description, 
            salary,
            requirements:requirements.split(',').map(r =>r.trim()),
            experienceLevel,
            location,
            jobType,
            position,
            companyId,
            applications: [],
            created_by:userId
            });
     newJob.save();
    
    res.status(201).json({
        success:true,
        message:"Job created successfully",
        job:newJob
    })

    }catch(error){
        console.log("error during job creation is:",error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }

}