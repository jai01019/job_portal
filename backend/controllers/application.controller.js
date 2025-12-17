import { Application } from "../models/applicationmodel.js";
import Job from "../models/jobmodel.js";
export const createApplication = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(404).json({
        success: false,
        message: "JobId not find in params",
      });
    }

    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "Application already exists",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    return res.status(200).json({
      success: true,
      message: "Application is created",
      applicant: newApplication,
    });
  } catch (error) {
    console.log("error during the createApplication", error.message);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Application already exists",
      });
    }
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "userId not find ",
      });
    }

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",

        populate: { path: "company" },
      });
    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applied jobs found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Application is created",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.log("error during getAppliedJobs :", error.message);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(404).json({
        success: false,
        message: "jobId not find ",
      });
    }
    const job = await Job.findById(jobId)
    .populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      job,
    });
  } catch (error) {
    console.log("error during getApplicants :", error.message);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const updateAppicationStatus = async (req, res) => {
  try {
    const {status} = req.body;
    const applicantionId = req.params.id;
    if (!status) {
      return res.status(404).json({
        success: false,
        message: "status not find ",
      });
    }
    if (!applicantionId) {
      return res.status(404).json({
        success: false,
        message: "applicantionId not find ",
      });
    }


    const applicaton = await Application.findOne({ _id: applicantionId });
    if (!applicaton) {
      return res.status(404).json({
        success: false,
        message: "applicaton is not find for these applicantId",
      });
    }
 
    applicaton.status = status.toLowerCase();
    await applicaton.save();
    return res.status(200).json({
      success: true,
      message: "Application status updated successFully",
      applicaton,
    });
  } catch (error) {
    console.log("error during getApplicants :", error.message);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};
