/**
 * Enhanced API Routes Registration
 * This file registers all enhanced API routes without modifying the original server.js
 */
const contactRoutes = require("./api/contacts");

/**
 * Register enhanced routes with Express app
 * @param {Object} app - Express app
 */
module.exports = function registerEnhancedRoutes(app) {
  // Make sure path exists
  try {
    // Register contact routes
    app.use("/api/contacts", contactRoutes);
    console.log("Enhanced API routes registered successfully");
  } catch (error) {
    console.error("Error registering enhanced routes:", error.message);
    console.log("Some enhanced features may not work properly");
  }

  return app;
};
