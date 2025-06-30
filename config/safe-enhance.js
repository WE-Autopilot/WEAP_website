#!/usr/bin/env node

/**
 * WEAP Website Safe Enhancement Script
 *
 * This script applies security enhancements without modifying existing code.
 * It creates compatibility layers, ensures proper defaults, and adds security
 * features in a way that preserves all existing functionality.
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const chalk = require("chalk");

// Configuration
const CONFIG = {
  envFile: ".env",
  fallbackEnvFile: ".env.example",
  backupSuffix: ".bak",
  securityDefaults: {
    JWT_SECRET:
      process.env.JWT_SECRET ||
      "WEAP_default_jwt_secret_" + Math.random().toString(36).substring(2),
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1d",
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
    FILE_SIZE_LIMIT: process.env.FILE_SIZE_LIMIT || 5 * 1024 * 1024, // 5MB
    ALLOWED_ORIGINS:
      process.env.ALLOWED_ORIGINS ||
      "http://localhost:3000,http://localhost:5000",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/weap",
    PORT: process.env.PORT || 5000,
  },
};

// Utility functions
function log(message, type = "info") {
  const prefix = {
    info: chalk.blue("ℹ"),
    success: chalk.green("✓"),
    warning: chalk.yellow("⚠"),
    error: chalk.red("✖"),
  }[type];

  console.log(`${prefix} ${message}`);
}

function backup(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}${CONFIG.backupSuffix}`;
    fs.copyFileSync(filePath, backupPath);
    log(`Backed up ${filePath} to ${backupPath}`, "info");
    return true;
  }
  return false;
}

// Enhancement functions
function ensureEnvironmentVariables() {
  log("Checking environment configuration...", "info");

  // Load existing env vars
  dotenv.config({ path: CONFIG.envFile });

  // Create .env from example if it doesn't exist
  if (!fs.existsSync(CONFIG.envFile) && fs.existsSync(CONFIG.fallbackEnvFile)) {
    fs.copyFileSync(CONFIG.fallbackEnvFile, CONFIG.envFile);
    log(`Created ${CONFIG.envFile} from ${CONFIG.fallbackEnvFile}`, "success");
  }

  // Ensure all required variables have defaults
  let envContent = "";
  if (fs.existsSync(CONFIG.envFile)) {
    envContent = fs.readFileSync(CONFIG.envFile, "utf8");
  }

  let modified = false;
  Object.entries(CONFIG.securityDefaults).forEach(([key, value]) => {
    if (!process.env[key] && !envContent.includes(`${key}=`)) {
      envContent += `\n${key}=${value}`;
      log(`Added missing environment variable: ${key}`, "info");
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(CONFIG.envFile, envContent.trim());
    log("Updated environment variables with secure defaults", "success");
  } else {
    log("Environment variables are properly configured", "success");
  }
}

function createCompatibilityShims() {
  log("Creating compatibility shims...", "info");

  // Create a directory for compatibility modules if it doesn't exist
  const compatDir = path.join("server", "utils", "compat");
  if (!fs.existsSync(compatDir)) {
    fs.mkdirSync(compatDir, { recursive: true });
    log(`Created compatibility directory: ${compatDir}`, "success");
  }

  // Create a file path compatibility shim
  const filePathCompat = path.join(compatDir, "paths.js");
  fs.writeFileSync(
    filePathCompat,
    `
/**
 * File path compatibility shim
 * This module normalizes file paths across the application
 */
const path = require('path');

// Default upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Export standard path functions for consistent usage
module.exports = {
  getUploadPath: (filename) => path.join(UPLOAD_DIR, filename),
  getUploadDir: () => UPLOAD_DIR,
  normalizePath: (filepath) => path.normalize(filepath),
  // Safe path joining that prevents directory traversal
  safeJoin: (base, ...parts) => {
    const fullPath = path.join(base, ...parts);
    const normalized = path.normalize(fullPath);
    if (!normalized.startsWith(base)) {
      throw new Error('Path traversal attempt detected');
    }
    return normalized;
  }
};
`
  );
  log(`Created file path compatibility shim: ${filePathCompat}`, "success");

  // Create a MongoDB connection shim
  const mongoCompat = path.join(compatDir, "mongodb.js");
  fs.writeFileSync(
    mongoCompat,
    `
/**
 * MongoDB connection compatibility shim
 * Provides a consistent connection interface with fallbacks
 */
const mongoose = require('mongoose');

// Default connection string with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/weap';

// Connection options with reasonable defaults
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: process.env.NODE_ENV !== 'production', // Disable in production for performance
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
};

// Connection function with retry logic
async function connect(retries = 5, delay = 2000) {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI, options);
      console.log('MongoDB connected successfully');
      return mongoose.connection;
    } catch (err) {
      lastError = err;
      console.error(\`MongoDB connection attempt \${attempt} failed: \${err.message}\`);
      
      if (attempt < retries) {
        console.log(\`Retrying in \${delay/1000} seconds...\`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next attempt
        delay = Math.min(delay * 1.5, 10000);
      }
    }
  }
  
  throw new Error(\`Failed to connect to MongoDB after \${retries} attempts: \${lastError.message}\`);
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = { connect, connection: mongoose.connection };
`
  );
  log(
    `Created MongoDB connection compatibility shim: ${mongoCompat}`,
    "success"
  );

  // Create an authentication compatibility shim
  const authCompat = path.join(compatDir, "auth.js");
  fs.writeFileSync(
    authCompat,
    `
/**
 * Authentication compatibility shim
 * Provides consistent auth functionality with security enhancements
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Get JWT settings with secure defaults
const JWT_SECRET = process.env.JWT_SECRET || 'WEAP_default_jwt_secret_' + crypto.randomBytes(32).toString('hex');
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

// Generate tokens with consistent settings
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

// Verify tokens with error handling
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Extract token from various request formats
function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.query && req.query.token) {
    return req.query.token;
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

// Authentication middleware
function authenticate(req, res, next) {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  authenticate,
};
`
  );
  log(`Created authentication compatibility shim: ${authCompat}`, "success");

  // Create a file validation compatibility shim
  const fileValidationCompat = path.join(compatDir, "fileValidation.js");
  fs.writeFileSync(
    fileValidationCompat,
    `
/**
 * File validation compatibility shim
 * Provides consistent file validation with security enhancements
 */
const path = require('path');
const fs = require('fs');
const fileType = require('file-type');

// Default settings with secure values
const FILE_SIZE_LIMIT = parseInt(process.env.FILE_SIZE_LIMIT || 5 * 1024 * 1024, 10); // 5MB
const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(',');
const ALLOWED_EXTENSIONS = (process.env.ALLOWED_EXTENSIONS || '.jpg,.jpeg,.png,.gif,.pdf').split(',');

// Helper functions
function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function isAllowedExtension(filename) {
  const ext = getExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext);
}

function isAllowedMimeType(mimeType) {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

function isWithinSizeLimit(size) {
  return size <= FILE_SIZE_LIMIT;
}

// Validate file based on extension, MIME type, and size
async function validateFile(file) {
  // Check file size
  if (!isWithinSizeLimit(file.size)) {
    return {
      valid: false,
      error: \`File size exceeds the limit of \${FILE_SIZE_LIMIT / 1024 / 1024}MB\`
    };
  }
  
  // Check file extension
  if (!isAllowedExtension(file.originalname)) {
    return {
      valid: false,
      error: 'File type not allowed based on extension'
    };
  }
  
  // Additional check: Verify MIME type
  if (!isAllowedMimeType(file.mimetype)) {
    return {
      valid: false,
      error: 'File type not allowed based on MIME type'
    };
  }
  
  // Advanced validation: check file content type using file-type
  try {
    // For buffer content
    if (file.buffer) {
      const fileInfo = await fileType.fromBuffer(file.buffer);
      if (fileInfo && !ALLOWED_MIME_TYPES.includes(fileInfo.mime)) {
        return {
          valid: false,
          error: 'File content type does not match allowed types'
        };
      }
    } 
    // For files already saved to disk
    else if (file.path && fs.existsSync(file.path)) {
      const buffer = fs.readFileSync(file.path);
      const fileInfo = await fileType.fromBuffer(buffer);
      if (fileInfo && !ALLOWED_MIME_TYPES.includes(fileInfo.mime)) {
        // Remove the invalid file
        fs.unlinkSync(file.path);
        return {
          valid: false,
          error: 'File content type does not match allowed types'
        };
      }
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: \`File validation error: \${error.message}\`
    };
  }
}

module.exports = {
  validateFile,
  isAllowedExtension,
  isAllowedMimeType,
  isWithinSizeLimit,
  FILE_SIZE_LIMIT,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS
};
`
  );
  log(
    `Created file validation compatibility shim: ${fileValidationCompat}`,
    "success"
  );
}

function createEnhanceMiddleware() {
  log("Creating enhanced middleware bridge...", "info");

  const middlewarePath = path.join(
    "server",
    "middleware",
    "enhanced-bridge.js"
  );
  fs.writeFileSync(
    middlewarePath,
    `
/**
 * Enhanced middleware bridge
 * Provides a compatibility layer between existing middleware and enhanced functionality
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');

// Import compatibility shims
const { authenticate } = require('../utils/compat/auth');
const { validateFile } = require('../utils/compat/fileValidation');

// Security settings with defaults
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, 10);
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || 100, 10);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5000').split(',');

// Create middleware router
const router = express.Router();

// Apply secure defaults
router.use(helmet());
router.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
router.use(express.json({ limit: '10kb' }));
router.use(express.urlencoded({ extended: true, limit: '10kb' }));
router.use(cookieParser());
router.use(mongoSanitize());
router.use(xss());
router.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later'
});
router.use('/api', limiter);

// CSRF protection for non-API routes
const csrfProtection = csrf({ cookie: true });
router.use((req, res, next) => {
  // Skip CSRF for API routes and OPTIONS requests
  if (req.path.startsWith('/api') || req.method === 'OPTIONS') {
    return next();
  }
  csrfProtection(req, res, next);
});

// Middleware exports
module.exports = {
  router,
  authenticate,
  validateFile,
  csrfProtection
};
`
  );
  log(`Created enhanced middleware bridge: ${middlewarePath}`, "success");
}

function createInitScript() {
  log("Creating initialization script...", "info");

  const initPath = "init-safe-enhancements.js";
  fs.writeFileSync(
    initPath,
    `
/**
 * Initialize safe enhancements
 * This script initializes all compatibility shims and security enhancements
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Ensure compatibility directories exist
const compatDir = path.join('server', 'utils', 'compat');
if (!fs.existsSync(compatDir)) {
  fs.mkdirSync(compatDir, { recursive: true });
  console.log(\`Created compatibility directory: \${compatDir}\`);
}

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(\`Created uploads directory: \${uploadDir}\`);
}

// Print environment configuration
console.log('Using environment configuration:');
[
  'JWT_SECRET',
  'JWT_EXPIRATION',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX',
  'FILE_SIZE_LIMIT',
  'ALLOWED_ORIGINS',
  'MONGODB_URI',
  'PORT'
].forEach(key => {
  // Don't print actual secrets
  if (key === 'JWT_SECRET') {
    console.log(\`  \${key}: [REDACTED]\`);
  } else {
    console.log(\`  \${key}: \${process.env[key] || 'Not set (will use default)'}\`);
  }
});

console.log('\\nSafe enhancements initialized successfully!');
console.log('You can now start your application with enhanced security features.');
console.log('\\nTo use the enhanced functionality, import from the compatibility modules:');
console.log('  - File paths: require("./server/utils/compat/paths")');
console.log('  - MongoDB: require("./server/utils/compat/mongodb")');
console.log('  - Auth: require("./server/utils/compat/auth")');
console.log('  - File validation: require("./server/utils/compat/fileValidation")');
console.log('\\nFor enhanced middleware, use:');
console.log('  const { router, authenticate, validateFile } = require("./server/middleware/enhanced-bridge");');
console.log('  app.use(router); // Apply all enhanced middleware');
`
  );
  log(`Created initialization script: ${initPath}`, "success");
}

// Main execution
async function main() {
  log("Starting safe enhancement process...", "info");

  try {
    // Ensure environment variables
    ensureEnvironmentVariables();

    // Create compatibility shims
    createCompatibilityShims();

    // Create enhanced middleware bridge
    createEnhanceMiddleware();

    // Create initialization script
    createInitScript();

    log("Safe enhancements applied successfully!", "success");
    log(
      "To initialize the enhancements, run: node init-safe-enhancements.js",
      "info"
    );
  } catch (error) {
    log(`Error applying safe enhancements: ${error.message}`, "error");
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
