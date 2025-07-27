# WEAP Environment Configuration

This directory contains configuration files for the WEAP application. The configuration system supports multiple environments (development, production, test) and validates required environment variables.

## Directory Structure

```
config/
├── config.js             # Main configuration module
├── database.js           # Database connection configuration
├── env.example           # Example environment variables
├── environments/         # Environment-specific configuration files
│   ├── .env.development  # Development environment configuration
│   ├── .env.production   # Production environment configuration
│   └── .env.test         # Test environment configuration (optional)
└── README.md             # This file
```

## Usage

The configuration system works alongside your existing code without any changes required. To use it in your code:

```javascript
// Import the configuration
const config = require('./config/config');

// Use configuration values
console.log(`Environment: ${config.env}`);
console.log(`MongoDB URI: ${config.mongodb.uri}`);
console.log(`Server port: ${config.server.port}`);
```

## Environment-Specific Configuration

The system loads configuration from the appropriate environment file based on `NODE_ENV`:

- For development: `environments/.env.development`
- For production: `environments/.env.production`
- For testing: `environments/.env.test`

## Running with Different Environments

You can specify the environment when running the server:

```bash
# Run in development mode (default)
NODE_ENV=development node server.js

# Run in production mode
NODE_ENV=production node server.js

# Run in test mode
NODE_ENV=test node server.js
```

## Checking Configuration

Use the configuration checker script to validate your environment setup:

```bash
node scripts/check-config.js
```

This script will display your current configuration and warn about potential issues.

## Required Environment Variables

The following environment variables should be defined:

- `NODE_ENV`: The current environment (development, production, test)
- `PORT`: The port number to run the server on
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CLIENT_URL`: URL of the client application

## Benefits

This configuration system provides:

1. Environment-specific settings (dev/prod/test)
2. Centralized configuration management
3. Validation of required variables
4. Type conversion for numeric values
5. Default values for optional settings
6. Secure handling of sensitive information

Without modifying your existing codebase, this approach allows for more robust environment configuration following industry best practices. 