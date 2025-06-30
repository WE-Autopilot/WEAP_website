/**
 * Input validation middleware using express-validator
 */
const { body } = require("express-validator");

/**
 * Application form validation rules
 */
exports.applicationValidationRules = [
  // Name validation
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters")
    .trim(),

  // Email validation
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  // School email validation
  body("schoolEmail")
    .notEmpty()
    .withMessage("School email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/@(?:[\w-]+\.)*uwo\.ca$/)
    .withMessage("Must be a UWO email address")
    .normalizeEmail(),

  // Student ID validation
  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .matches(/^[0-9]{8,10}$/)
    .withMessage("Student ID must be 8-10 digits"),

  // Program validation
  body("program").notEmpty().withMessage("Program is required").trim(),

  // Team validation
  body("team").notEmpty().withMessage("Team selection is required").trim(),

  // Resume URL validation (if provided)
  body("resumeUrl")
    .optional()
    .custom((value) => !value || value.startsWith("http"))
    .withMessage("URL must start with http:// or https://"),

  // Resume method validation
  body("resumeMethod")
    .optional()
    .isIn(["url", "file"])
    .withMessage("Resume method must be url or file"),
];
