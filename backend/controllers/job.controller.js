import Job from "../models/jobmodel.js";

export const createJob = (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      requirements,
      experienceLevel,
      location,
      jobType,
      position,
      companyId,
    } = req.body;

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
        message: "Some required fields are missing",
      });
    }

    let userId = req.id;
    console.log("userId from createJob:", userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Required Field Is Missing",
      });
    }

    const newJob = new Job({
      title,
      description,
      salary: Number(salary),
      requirements: requirements.split(",").map((r) => r.trim()),
      experienceLevel,
      location,
      jobType,
      position,
      company: companyId,
      applications: [],
      created_by: userId,
    });
    newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.log("error during job creation is:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const jobs = await Job.find(query).populate("company" ).sort({
      createdAt: -1,
    });
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "job fetch successFully",
      jobs,
    });
  } catch (error) {
    console.log("error while getALlJobs:", error.message),
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobs = await Job.findById(jobId);
    if (!jobs) {
      {
        return res.status(400).json({
          success: false,
          message: "Job not find",
        });
      }
    }
    res.status(200).json({
      success: true,
      message: "Job search successFully",
      jobs,
    });
  } catch (error) {
    console.log("error during getJobById :", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Required Field Is Missing",
      });
    }

    const adminJob = await Job.find({ created_by: adminId });
    if (adminJob.length === 0) {
      return res.status(400).json({
        success: false,
        message: "adminJob is not found",
      });
    }

    res.status(200).json({
      message: "job fetch successFully for Admin",
      adminJob,
      success: true,
    });
  } catch (error) {
    console.log("error during getJobById :", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
