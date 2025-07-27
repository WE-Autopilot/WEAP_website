/**
 * Enhanced error handling utilities
 * Works alongside existing error handling without changing it
 */

// Error types that match client-side error types
const ErrorTypes = {
  VALIDATION: "VALIDATION_ERROR",
  AUTHENTICATION: "AUTHENTICATION_ERROR",
  AUTHORIZATION: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  CONFLICT: "CONFLICT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

/**
 * Enhanced error class with additional properties
 * @extends Error
 */
class EnhancedError extends Error {
  /**
   * Create a new enhanced error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {string} type - Error type from ErrorTypes
   * @param {object|array} details - Error details
   * @param {boolean} isOperational - Is this an operational error?
   */
  constructor(
    statusCode,
    message,
    type = ErrorTypes.SERVER_ERROR,
    details = null,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create common error types for consistent error handling
 */
const createValidationError = (message, details) =>
  new EnhancedError(400, message, ErrorTypes.VALIDATION, details);

const createAuthenticationError = (message = "Authentication required") =>
  new EnhancedError(401, message, ErrorTypes.AUTHENTICATION);

const createAuthorizationError = (
  message = "Not authorized to perform this action"
) => new EnhancedError(403, message, ErrorTypes.AUTHORIZATION);

const createNotFoundError = (message = "Resource not found") =>
  new EnhancedError(404, message, ErrorTypes.NOT_FOUND);

const createConflictError = (message, details) =>
  new EnhancedError(409, message, ErrorTypes.CONFLICT, details);

const createServerError = (message = "Internal server error") =>
  new EnhancedError(500, message, ErrorTypes.SERVER_ERROR, null, false);

/**
 * Enhanced error handling middleware
 * Can be used alongside the existing error handler
 */
const enhancedErrorMiddleware = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let type = err.type || ErrorTypes.SERVER_ERROR;
  let message = err.message || "An unexpected error occurred";
  let details = err.details || null;
  let timestamp = err.timestamp || new Date().toISOString();
  let isOperational =
    err.isOperational !== undefined ? err.isOperational : true;

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    type = ErrorTypes.VALIDATION;
    message = "Validation Error";
    details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  // Handle Mongoose cast errors (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    type = ErrorTypes.VALIDATION;
    message = `Invalid ${err.path}`;
    details = { field: err.path, value: err.value };
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    type = ErrorTypes.CONFLICT;
    message = "Duplicate key error";
    const field = Object.keys(err.keyValue)[0];
    details = { field, value: err.keyValue[field] };
  }

  // Log error
  const errorLog = {
    timestamp,
    type,
    message,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode,
  };

  if (!isOperational) {
    console.error("[CRITICAL ERROR]", errorLog, err);
  } else {
    console.error("[ERROR]", errorLog);
  }

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    error: {
      type,
      message,
      details,
      timestamp,
      // Only include stack trace in development and for non-operational errors
      ...(process.env.NODE_ENV === "development" &&
        !isOperational && { stack: err.stack }),
    },
  });
};

module.exports = {
  EnhancedError,
  ErrorTypes,
  enhancedErrorMiddleware,
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createNotFoundError,
  createConflictError,
  createServerError,
};
