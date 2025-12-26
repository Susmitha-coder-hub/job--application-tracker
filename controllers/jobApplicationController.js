// controllers/jobApplicationController.js
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const JobApplication = require('../models/JobApplication');
const ApplicationHistory = require('../models/ApplicationHistory');
const { sendStageChangeEmail } = require('../services/emailservices');
const { VALID_TRANSITIONS } = require('../services/applicationStateService');

// ------------------- Candidate Endpoints ------------------- //

// Create a job application
const createApplication = async (req, res) => {
  // Input validation
  await body('title').notEmpty().withMessage('Title is required').run(req);
  await body('company').notEmpty().withMessage('Company is required').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const application = await JobApplication.create({
      ...req.body,
      candidate: req.user.id, // assuming req.user.id comes from JWT
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications for the logged-in candidate
const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ candidate: req.user.id });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a job application (except stage)
const updateApplication = async (req, res) => {
  const updates = { ...req.body };
  delete updates.stage; // candidates cannot update stage

  try {
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, candidate: req.user.id },
      updates,
      { new: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a job application
const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      candidate: req.user.id,
    });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------- Recruiter Endpoint ------------------- //

// Change application stage
const changeApplicationStage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const application = await JobApplication.findById(req.params.id).session(session);
    if (!application) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Application not found' });
    }

    const prevStage = application.stage;
    const nextStage = req.body.stage;

    // Validate stage transition
    if (!VALID_TRANSITIONS[prevStage].includes(nextStage)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: `Invalid stage transition from ${prevStage} to ${nextStage}` });
    }

    application.stage = nextStage;
    await application.save({ session });

    // Log history
    await ApplicationHistory.create(
      [{ application: application._id, from: prevStage, to: nextStage }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Send email asynchronously
    setImmediate(async () => {
      try {
        await sendStageChangeEmail(application);
      } catch (err) {
        console.error('Failed to send stage change email:', err.message);
      }
    });

    res.status(200).json({ message: 'Application stage updated successfully', application });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  updateApplication,
  deleteApplication,
  changeApplicationStage,
};
