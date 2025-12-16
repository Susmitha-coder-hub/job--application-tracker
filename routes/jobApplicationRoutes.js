const express = require('express');
const router = express.Router();

const {
  createJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  changeApplicationStage,
} = require('../controllers/jobApplicationController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 🔐 All routes require authentication
router.use(authMiddleware);

/**
 * 👤 Candidate only
 */
router.post(
  '/',
  roleMiddleware('candidate'),
  createJobApplication
);

router.put(
  '/:id',
  roleMiddleware('candidate'),
  updateJobApplication
);

router.delete(
  '/:id',
  roleMiddleware('candidate'),
  deleteJobApplication
);

/**
 * 🧑‍💼 Recruiter only
 */
router.get(
  '/',
  roleMiddleware('recruiter'),
  getJobApplications
);

router.patch(
  '/:id/stage',
  roleMiddleware('recruiter'),
  changeApplicationStage
);

module.exports = router;
