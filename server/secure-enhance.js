/**
 * WEAP Security Enhancement Integration
 *
 * This file applies security enhancements without modifying existing code.
 * Following industry standards while preserving your codebase.
 */
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

/**
 * Apply security enhancements to Express app
 * @param {Object} app Express application
 * @returns {Object} Enhanced Express application
 */
function secureEnhance(app) {
  console.log(
    "Applying security enhancements without modifying existing code..."
  );

  // 1. Secure environment variables
  const enhanceEnv = () => {
    // Check for insecure JWT secret
    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET === "your-secret-key"
    ) {
      const secureSecret = crypto.randomBytes(64).toString("hex");
      process.env.JWT_SECRET = secureSecret;
      console.log(
        "⚠️  WARNING: Insecure JWT_SECRET detected, using generated secure secret"
      );
      console.log(
        "   For production, please set JWT_SECRET in .env with a strong random value"
      );
    }
  };
  enhanceEnv();

  // 2. Add CSRF protection without modifying existing code
  const csrf = require("csurf");
  const cookieParser = require("cookie-parser");
  // Use cookie parser if not already used
  app.use(cookieParser());

  // Create CSRF protection that exempts API routes
  const csrfProtection = csrf({ cookie: true });
  app.use((req, res, next) => {
    // Skip CSRF for API routes
    if (req.path.startsWith("/api/") || req.method === "OPTIONS") {
      return next();
    }
    // Apply CSRF protection to all other routes
    csrfProtection(req, res, next);
  });

  // 3. Enhanced file validation with magic number checking
  const fileType = require("file-type");
  // Add file validation magic number checking to request pipeline
  app.use(async (req, res, next) => {
    // Only process file uploads
    if (req.file || (req.files && req.files.length)) {
      try {
        // Process single file
        if (req.file && req.file.buffer) {
          const fileInfo = await fileType.fromBuffer(req.file.buffer);
          if (fileInfo && fileInfo.mime !== req.file.mimetype) {
            console.log();
            return res.status(400).json({
              success: false,
              message: "Invalid file type",
            });
          }
        }
      } catch (error) {
        console.error("Error validating file:", error);
      }
    }
    next();
  });

  // 4. Add production-only CORS protection
  if (process.env.NODE_ENV === "production") {
    console.log(
      "⚠️  Production environment detected - removing development CORS origins"
    );
    // Remove localhost from allowed origins
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (
        origin &&
        (origin.includes("localhost") || origin.includes("127.0.0.1"))
      ) {
        return res.status(403).json({
          success: false,
          message: "Development origins not allowed in production",
        });
      }
      next();
    });
  }

  console.log("✅ Security enhancements applied successfully");
  return app;
}

module.exports = secureEnhance;
