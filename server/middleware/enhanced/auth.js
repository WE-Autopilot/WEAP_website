/**
 * Enhanced Authentication Middleware
 * Provides JWT-based authentication
 */
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

/**
 * JWT authentication middleware
 * Verifies the JWT token and adds the user to the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.authenticateJWT = (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Unauthorized - No token provided"));
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(createError(401, "Unauthorized - Invalid token format"));
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_jwt_secret_replace_in_production"
    );

    // Add user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Unauthorized - Invalid token"));
    }

    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Unauthorized - Token expired"));
    }

    next(createError(500, "Internal Server Error - Authentication Failed"));
  }
};
