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
const multer = require("multer");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
router.post(
  "/",
  upload.single("resume"), // This will process one file under the field name 'resume'
  apiLimiter,
  applicationValidationRules,
  createApplication
);

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
