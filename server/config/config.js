/**
 * Centralized configuration module
 * Works alongside existing configuration patterns
 */
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Function to load environment-specific config without breaking existing code
function loadEnvConfig() {
  // Try to load environment-specific file first
  const nodeEnv = process.env.NODE_ENV || "development";
  const envPath = path.resolve(
    process.cwd(),
    `server/config/environments/.env.${nodeEnv}`
  );

  if (fs.existsSync(envPath)) {
    console.log(`[Config] Loading environment from ${envPath}`);
    dotenv.config({ path: envPath });
  }

  // Allow existing dotenv.config() calls to still work
  // This won't override what we loaded above
}

// Initialize environment without breaking existing code
loadEnvConfig();

// Create config object that can be imported where needed
const config = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment:
    process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test",
  isTest: process.env.NODE_ENV === "test",

  server: {
    port: parseInt(process.env.PORT || "5000", 10),
    host: process.env.HOST || "localhost",
  },

  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/weap_db",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  jwt: {
    secret:
      process.env.JWT_SECRET || "default_jwt_secret_replace_in_production",
    expiresIn: process.env.JWT_EXPIRE || "30d",
  },

  client: {
    url: process.env.CLIENT_URL || "http://localhost:5173",
  },

  rateLimit: {
    standard: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    },
    auth: {
      windowMs: parseInt(
        process.env.AUTH_RATE_LIMIT_WINDOW_MS || "3600000",
        10
      ),
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10", 10),
    },
  },

  cors: {
    allowedOrigins: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://weap.yourwebsite.com",
    ],
  },
};

// Export the config for use in other files
module.exports = config;
