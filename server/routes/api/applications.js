/**
 * Application routes
 * @module routes/api/applications
 */
const express = require("express");
const router = express.Router();
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../../controllers/applicationController");
const { applicationValidationRules } = require("../../middleware/validators");
const { protect, authorize } = require("../../middleware/auth");
const { apiLimiter } = require("../../middleware/rateLimiter");

/**
 * @route   GET /api/applications
 * @desc    Get all applications with pagination and filtering
 * @access  Private (admin only)
 */
router.get("/", protect, authorize("admin"), getApplications);

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application by ID
 * @access  Private (admin only)
 */
router.get("/:id", protect, authorize("admin"), getApplication);

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Public
 */
router.post("/", apiLimiter, applicationValidationRules, createApplication);

/**
 * @route   PUT /api/applications/:id
 * @desc    Update an application
 * @access  Private (admin only)
 */
router.put(
  "/:id",
  protect,
  authorize("admin"),
  applicationValidationRules,
  updateApplication
);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application
 * @access  Private (admin only)
 */
router.delete("/:id", protect, authorize("admin"), deleteApplication);

module.exports = router;
