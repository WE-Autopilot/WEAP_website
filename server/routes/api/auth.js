/**
 * Authentication routes
 * @module routes/api/auth
 */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, getMe } = require("../../controllers/authController");
const { protect } = require("../../middleware/auth");
const { authLimiter } = require("../../middleware/rateLimiter");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please include a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .isEmail()
      .withMessage("Please include a valid email")
      .normalizeEmail(),
    body("password").exists().withMessage("Password is required"),
  ],
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", protect, getMe);

module.exports = router;
