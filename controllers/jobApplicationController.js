const JobApplication = require('../models/jobApplicationModel'); // use the exact filename
const { canTransition } = require("../services/applicationStateService");
const ApplicationHistory = require('../models/ApplicationHistory'); // For audit trail
const sendStageChangeEmail = require('../utils/email'); // For email notifications


// Create a new job application
const createJobApplication = async (req, res) => {
  try {
    const { title, company, candidateEmail } = req.body;

    const job = await JobApplication.create({
      title,
      company,
      user: req.user.userId, // from auth middleware
      candidateEmail // store candidate email if needed
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all job applications for the logged-in user
const getJobApplications = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user: req.user.userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a job application (EXCEPT stage)
const updateJobApplication = async (req, res) => {
  try {
    // 🚫 Prevent stage update here
    if (req.body.stage) {
      return res.status(403).json({
        message: "Stage cannot be updated using this endpoint",
      });
    }

    const { id } = req.params;

    const job = await JobApplication.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a job application
const deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobApplication.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const changeApplicationStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const application = await JobApplication.findById(id).populate("user");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const previousStage = application.stage;

    // validate workflow
    if (!canTransition(previousStage, stage)) {
      return res.status(400).json({
        message: `Invalid transition from ${previousStage} to ${stage}`,
      });
    }

    // update stage
    application.stage = stage;
    await application.save();

    // save history
    await ApplicationHistory.create({
      jobApplicationId: application._id,
      previousStage,
      newStage: stage,
      changedBy: req.user.userId,
    });

    // 🔔 SEND EMAIL (THIS WAS MISSING)
    if (application.user.email) {
      await sendStageChangeEmail(
        application.user.email,
        application.title,
        previousStage,
        stage
      );
    }

    res.json({
      message: "Application stage updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ EXPORT EVERYTHING
module.exports = {
  createJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  changeApplicationStage,
};
