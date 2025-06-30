/**
 * Authentication middleware
 * Protects routes requiring authentication
 */
const jwt = require("jsonwebtoken");
const { ApiError } = require("./errorHandler");
const User = require("../models/User");

/**
 * Middleware to protect routes
 * Verifies JWT token and attaches user to request
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return next(new ApiError(401, "Not authorized to access this route"));
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_jwt_secret_replace_in_production"
      );

      // Attach user to request object
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return next(new ApiError(401, "Not authorized to access this route"));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware for role-based authorization
 * @param {...String} roles - Allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Not authorized to perform this action"));
    }
    next();
  };
};
