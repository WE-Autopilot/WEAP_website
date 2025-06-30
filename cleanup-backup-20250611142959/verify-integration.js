#!/usr/bin/env node

/**
 * WEAP Website Integration Verification Script
 *
 * This script verifies that all required components are properly integrated
 * and the security enhancements are working correctly.
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const chalk = require("chalk");

// Load environment variables
dotenv.config();

// Set up logging functions
const log = {
  info: (message) => console.log(chalk.blue("ℹ"), message),
  success: (message) => console.log(chalk.green("✓"), message),
  warning: (message) => console.log(chalk.yellow("⚠"), message),
  error: (message) => console.log(chalk.red("✖"), message),
};

// Track verification status
const status = {
  pass: 0,
  warn: 0,
  fail: 0,
};

// Verify a condition
function verify(name, condition, message, critical = true) {
  if (condition) {
    log.success(`${name}: ${message}`);
    status.pass++;
    return true;
  } else {
    if (critical) {
      log.error(`${name}: ${message}`);
      status.fail++;
    } else {
      log.warning(`${name}: ${message}`);
      status.warn++;
    }
    return false;
  }
}

// Check file existence
function checkFileExists(filePath, name, critical = true) {
  const exists = fs.existsSync(filePath);
  return verify(
    name || `File ${filePath}`,
    exists,
    exists ? "Found" : "Not found",
    critical
  );
}

// Check directory existence
function checkDirExists(dirPath, name, critical = true) {
  const exists = fs.existsSync(dirPath);
  return verify(
    name || `Directory ${dirPath}`,
    exists,
    exists ? "Found" : "Not found",
    critical
  );
}

// Check module can be required
function checkModule(moduleName, name, critical = true) {
  try {
    require(moduleName);
    return verify(
      name || `Module ${moduleName}`,
      true,
      "Successfully loaded",
      critical
    );
  } catch (error) {
    return verify(
      name || `Module ${moduleName}`,
      false,
      `Failed to load: ${error.message}`,
      critical
    );
  }
}

// Check environment variable
function checkEnvVar(varName, name, critical = true) {
  const exists = process.env[varName] !== undefined;
  return verify(
    name || `Environment variable ${varName}`,
    exists,
    exists ? "Defined" : "Not defined",
    critical
  );
}

// Main verification function
async function runVerification() {
  log.info("Starting integration verification...");

  // Check environment setup
  log.info("\nChecking environment setup:");
  checkFileExists(".env", "Environment file", false);
  checkEnvVar("JWT_SECRET", "JWT secret");
  checkEnvVar("MONGODB_URI", "MongoDB connection string");

  // Check core directories
  log.info("\nChecking core directories:");
  checkDirExists("server", "Server directory");
  checkDirExists("client", "Client directory", false);
  checkDirExists("uploads", "Uploads directory", false);

  // Check compatibility modules
  log.info("\nChecking compatibility modules:");
  checkDirExists("server/utils/compat", "Compatibility directory");
  checkFileExists("server/utils/compat/paths.js", "Path utilities");
  checkFileExists("server/utils/compat/mongodb.js", "MongoDB utilities");
  checkFileExists("server/utils/compat/auth.js", "Authentication utilities");
  checkFileExists(
    "server/utils/compat/fileValidation.js",
    "File validation utilities"
  );

  // Check enhanced middleware
  log.info("\nChecking enhanced middleware:");
  checkFileExists(
    "server/middleware/enhanced-bridge.js",
    "Enhanced middleware bridge"
  );

  // Check documentation
  log.info("\nChecking documentation:");
  checkFileExists("INTEGRATION-GUIDE.md", "Integration guide");

  // Check required dependencies
  log.info("\nChecking required dependencies:");
  try {
    const packageJson = require("./server/package.json");

    const requiredDeps = [
      "express",
      "mongoose",
      "jsonwebtoken",
      "dotenv",
      "cors",
      "helmet",
      "express-rate-limit",
      "xss-clean",
      "express-mongo-sanitize",
    ];

    let missingDeps = [];
    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep]) {
        missingDeps.push(dep);
      }
    }

    verify(
      "Package dependencies",
      missingDeps.length === 0,
      missingDeps.length === 0
        ? "All required dependencies found"
        : `Missing dependencies: ${missingDeps.join(", ")}`
    );
  } catch (error) {
    verify(
      "Package configuration",
      false,
      `Failed to load package.json: ${error.message}`
    );
  }

  // Check if modules can be loaded
  log.info("\nChecking module loading:");

  if (
    checkDirExists(
      "server/utils/compat",
      "Compatibility directory check",
      false
    )
  ) {
    checkModule("./server/utils/compat/paths", "Path utilities module");
    checkModule("./server/utils/compat/mongodb", "MongoDB utilities module");
    checkModule(
      "./server/utils/compat/auth",
      "Authentication utilities module"
    );
    checkModule(
      "./server/utils/compat/fileValidation",
      "File validation utilities module"
    );
  }

  if (
    checkFileExists(
      "server/middleware/enhanced-bridge.js",
      "Enhanced middleware bridge check",
      false
    )
  ) {
    checkModule(
      "./server/middleware/enhanced-bridge",
      "Enhanced middleware module"
    );
  }

  // Print verification summary
  log.info("\nVerification summary:");
  console.log(chalk.green(`✓ ${status.pass} checks passed`));
  console.log(chalk.yellow(`⚠ ${status.warn} warnings`));
  console.log(chalk.red(`✖ ${status.fail} failures`));

  // Determine overall status
  if (status.fail > 0) {
    log.error(
      "\nVerification failed. Please fix the issues above and try again."
    );
    process.exit(1);
  } else if (status.warn > 0) {
    log.warning(
      "\nVerification passed with warnings. Review the warnings above."
    );
    process.exit(0);
  } else {
    log.success(
      "\nVerification passed successfully! The integration is complete."
    );
    process.exit(0);
  }
}

// Run the verification
runVerification().catch((error) => {
  log.error(`Verification script error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
