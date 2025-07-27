/**
 * Enhanced Features Integration Script
 *
 * This script integrates all enhanced features with the existing application
 * without modifying any existing code.
 *
 * Usage:
 * 1. Import this file in your server.js after creating the Express app
 * 2. Call the enhance function with your Express app as the argument
 *
 * Example:
 * ```
 * const express = require('express');
 * const app = express();
 *
 * // ... your existing middleware and configurations
 *
 * // Integrate enhanced features
 * const enhance = require('./enhance');
 * enhance(app);
 *
 * // ... your existing routes and error handlers
 * ```
 */

// Import enhanced routes
const registerEnhancedRoutes = require("./routes/index");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Create uploads directory if it doesn't exist
const ensureUploadsDirectory = () => {
  // Use a consistent path for uploads
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created uploads directory:", uploadDir);
  }
};

// Connect to MongoDB with error handling
const connectToMongoDB = async () => {
  // Use the same connection that might already exist
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection for enhanced features");
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/weap";

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully for enhanced features");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Enhanced features requiring MongoDB will be disabled");
    return null;
  }
};

// Load environment variables from .env file if not already loaded
const loadEnvVariables = () => {
  try {
    // Check if .env exists in the project root
    const rootEnvPath = path.join(__dirname, "../.env");
    if (fs.existsSync(rootEnvPath)) {
      dotenv.config({ path: rootEnvPath });
      console.log("Environment variables loaded from root .env file");
    } else {
      // Fallback to server directory .env
      const serverEnvPath = path.join(__dirname, ".env");
      if (fs.existsSync(serverEnvPath)) {
        dotenv.config({ path: serverEnvPath });
        console.log("Environment variables loaded from server .env file");
      } else {
        console.warn("No .env file found, using default values");
      }
    }

    // Provide fallback for critical variables
    process.env.JWT_SECRET =
      process.env.JWT_SECRET ||
      "weap_default_jwt_secret_please_change_in_production";
    process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";
    process.env.UPLOAD_MAX_SIZE = process.env.UPLOAD_MAX_SIZE || "5242880";
  } catch (error) {
    console.error("Error loading environment variables:", error.message);
    console.log("Using default environment variables");

    // Set default environment variables
    process.env.JWT_SECRET =
      "weap_default_jwt_secret_please_change_in_production";
    process.env.JWT_EXPIRE = "7d";
    process.env.UPLOAD_MAX_SIZE = "5242880";
  }
};

/**
 * Enhance the Express application with additional features
 * @param {Object} app - Express application
 * @returns {Object} - Enhanced Express application
 */
async function enhance(app) {
  console.log("Enhancing application with additional features...");

  // Load environment variables first
  loadEnvVariables();

  // Ensure uploads directory exists
  ensureUploadsDirectory();

  // Connect to MongoDB
  await connectToMongoDB();

  // Register enhanced routes
  registerEnhancedRoutes(app);

  // Log success
  console.log("Enhancement complete!");

  return app;
}

module.exports = enhance;
