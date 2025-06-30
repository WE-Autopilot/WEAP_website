/**
 * Contact API Routes
 */
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const contactController = require("../../controllers/contactController");
const validateFile = require("../../middleware/enhanced/fileValidation");
const { authenticateJWT } = require("../../middleware/enhanced/auth");

// Validation rules
const contactValidation = [
  check("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  check("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),
  check("subject")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Subject must be between 2 and 100 characters"),
  check("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
  check("phone")
    .optional()
    .matches(/^(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/)
    .withMessage("Please provide a valid phone number")
    .isLength({ max: 20 })
    .withMessage("Phone number cannot exceed 20 characters"),
];

// Routes
// @route   POST /api/contacts
// @desc    Create a new contact submission
// @access  Public
router.post(
  "/",
  contactValidation,
  validateFile({ optional: true }),
  contactController.createContact
);

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Private (admin only)
router.get("/", authenticateJWT, contactController.getContacts);

// @route   GET /api/contacts/:id
// @desc    Get a single contact
// @access  Private (admin only)
router.get("/:id", authenticateJWT, contactController.getContact);

// @route   PATCH /api/contacts/:id/status
// @desc    Update a contact's status
// @access  Private (admin only)
router.patch(
  "/:id/status",
  authenticateJWT,
  contactController.updateContactStatus
);

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private (admin only)
router.delete("/:id", authenticateJWT, contactController.deleteContact);

module.exports = router;
