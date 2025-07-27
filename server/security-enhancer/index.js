/**
 * Security Enhancer Integration
 * 
 * This module integrates security enhancements without modifying existing code.
 * 
 * Usage:
 * const securityEnhancer = require("./security-enhancer");
 * securityEnhancer.enhance(app); // Pass your Express app
 */
 
const jwtEnhancer = require("./jwt-enhancer");
const fileValidator = require("./file-validator");
const corsEnhancer = require("./cors-enhancer");
const csrfProtection = require("./csrf-protection");

// Initialize and integrate security enhancements
exports.enhance = (app) => {
  console.log("Applying security enhancements...");
  
  // Apply CSRF protection
  csrfProtection.apply(app);
  
  // Apply secure CORS configuration
  corsEnhancer.apply(app);
  
  // Register security routes and middleware
  app.use("/security-status", (req, res) => {
    res.json({
      status: "ok",
      securityEnhanced: true,
      timestamp: new Date().toISOString()
    });
  });
  
  console.log("Security enhancements applied successfully");
  
  return app;
};

// Export sub-modules for direct use
exports.jwt = jwtEnhancer;
exports.files = fileValidator;
exports.cors = corsEnhancer;
exports.csrf = csrfProtection;