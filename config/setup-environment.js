/**
 * Environment Setup Script
 *
 * This script creates the necessary .env files and other configurations
 * required for the enhanced features to work properly.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate a secure random JWT secret
const generateJwtSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Create server .env file if it doesn't exist
const createServerEnv = () => {
  const envPath = path.join(__dirname, ".env");

  if (fs.existsSync(envPath)) {
    console.log("Server .env file already exists. Skipping...");
    return;
  }

  const envContent = `# JWT Authentication
JWT_SECRET=${generateJwtSecret()}
JWT_EXPIRE=7d

# File Upload
UPLOAD_MAX_SIZE=5242880

# MongoDB
MONGODB_URI=mongodb://localhost:27017/weap
NODE_ENV=development
PORT=5000
`;

  fs.writeFileSync(envPath, envContent);
  console.log("Created server .env file");
};

// Create client .env file if it doesn't exist
const createClientEnv = () => {
  const envPath = path.join(__dirname, "client", ".env");

  if (fs.existsSync(envPath)) {
    console.log("Client .env file already exists. Skipping...");
    return;
  }

  const envContent = `VITE_API_URL=http://localhost:5000/api`;

  fs.writeFileSync(envPath, envContent);
  console.log("Created client .env file");
};

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, "server", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory");
  } else {
    console.log("Uploads directory already exists. Skipping...");
  }
};

// Main function
const setup = () => {
  console.log("Setting up environment for enhanced features...");

  // Create necessary files and directories
  createServerEnv();
  createClientEnv();
  ensureUploadsDir();

  console.log("\nSetup complete! You can now start the application.");
  console.log("For more information, see INTEGRATION-GUIDE.md");
};

// Run setup
setup();
