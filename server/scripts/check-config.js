/**
 * Environment Configuration Checker
 * Validates that environment configuration is properly loaded
 */
const config = require("../config/config");

console.log("======================================================");
console.log("WEAP Environment Configuration");
console.log("======================================================");
console.log(`Environment:        ${config.env}`);
console.log(`Server Port:        ${config.server.port}`);
console.log(
  `MongoDB URI:        ${config.mongodb.uri.replace(
    /\/\/([^:]+):([^@]+)@/,
    "//***:***@"
  )}`
);
console.log(`JWT Expiration:     ${config.jwt.expiresIn}`);
console.log(`Client URL:         ${config.client.url}`);
console.log(
  `Rate Limit:         ${config.rateLimit.standard.max} requests per ${
    config.rateLimit.standard.windowMs / 60000
  } minutes`
);
console.log("======================================================");

// Check for potential issues
const warnings = [];

if (config.isProduction) {
  if (
    config.mongodb.uri.includes("localhost") ||
    config.mongodb.uri.includes("127.0.0.1")
  ) {
    warnings.push("Using local MongoDB in production environment");
  }

  if (config.jwt.secret === "default_jwt_secret_replace_in_production") {
    warnings.push("Using default JWT secret in production environment");
  }

  if (config.server.port < 1000) {
    warnings.push(
      "Using a low port number in production (may require elevated privileges)"
    );
  }
}

// Display warnings if any
if (warnings.length > 0) {
  console.log("\nWarnings:");
  warnings.forEach((warning) => {
    console.log(`⚠️  ${warning}`);
  });
}

console.log("\n✅ Configuration loaded successfully");
console.log("\nTo use this configuration in your code:");
console.log('  const config = require("./config/config");');
console.log("  console.log(`MongoDB URI: ${config.mongodb.uri}`);");
console.log("  console.log(`Server port: ${config.server.port}`);");
console.log("  console.log(`Environment: ${config.env}`);");
