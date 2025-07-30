# WEAP Website Integration Guide

This guide explains how to integrate industry-standard security enhancements with your existing WEAP website codebase without breaking changes.

## Overview

The safe enhancement approach provides compatibility layers that work alongside your existing code, adding security features without modifying your core functionality. This approach:

1. Creates compatibility modules that can be used alongside existing code
2. Sets secure defaults for environment variables
3. Provides enhanced middleware that can be used with your Express application
4. Standardizes file paths and validation
5. Improves MongoDB connection reliability
6. Adds CSRF protection and secure error handling

## Quick Start

The easiest way to integrate the enhancements is to run:

```bash
# Run the setup script
./start.sh
```

This will:
1. Set up your environment
2. Apply safe enhancements
3. Verify the integration
4. Install dependencies

## Manual Integration

If you prefer to manually integrate the enhancements, follow these steps:

1. Run the enhancement script:
```bash
node safe-enhance.js
```

2. Initialize the enhancements:
```bash
node init-safe-enhancements.js
```

3. Install required dependencies:
```bash
cd server && npm install
```

## Using the Enhanced Functionality

To use the enhanced functionality in your code, import from the compatibility modules:

### File Paths

```javascript
// Import the path utilities
const paths = require('./server/utils/compat/paths');

// Use the path utilities
const uploadPath = paths.getUploadPath('myfile.jpg');
const uploadDir = paths.getUploadDir();
const safePath = paths.safeJoin(uploadDir, 'subfolder', 'file.txt');
```

### MongoDB Connection

```javascript
// Import the MongoDB connection utility
const db = require('./server/utils/compat/mongodb');

// Connect to MongoDB with retry logic
async function startServer() {
  try {
    await db.connect();
    // Start your server here
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}
```

### Authentication

```javascript
// Import the authentication utilities
const auth = require('./server/utils/compat/auth');

// Generate a token
const token = auth.generateToken({ id: user._id });

// Use the authentication middleware in your routes
app.get('/api/protected', auth.authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### File Validation

```javascript
// Import the file validation utilities
const fileValidation = require('./server/utils/compat/fileValidation');

// Validate a file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const result = await fileValidation.validateFile(req.file);
  
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  
  // Process the valid file
});
```

### Enhanced Middleware

To apply all enhanced middleware at once:

```javascript
const { router } = require('./server/middleware/enhanced-bridge');

// Apply all enhanced middleware
app.use(router);
```

Or use individual middleware components:

```javascript
const { authenticate, validateFile, csrfProtection } = require('./server/middleware/enhanced-bridge');

// Use individual middleware components
app.get('/api/protected', authenticate, (req, res) => {
  // Protected route
});

app.post('/form', csrfProtection, (req, res) => {
  // CSRF protected form submission
});
```

## Security Features

The safe enhancements include:

1. **JWT Authentication**
   - Secure token generation and validation
   - Multiple token extraction methods
   - Configurable expiration

2. **Rate Limiting**
   - Configurable window and max requests
   - Applied to API routes by default

3. **CORS Configuration**
   - Configurable allowed origins
   - Credentials support

4. **File Validation**
   - Size limits
   - MIME type validation
   - File extension validation
   - Content type verification (magic number checking)

5. **MongoDB Connection**
   - Connection retry logic
   - Proper error handling
   - Graceful shutdown

6. **Path Security**
   - Directory traversal prevention
   - Path normalization
   - Upload directory management

7. **CSRF Protection**
   - Applied to non-API routes
   - Cookie-based tokens

8. **Additional Security Headers**
   - Helmet for HTTP headers
   - XSS protection
   - HTTP parameter pollution prevention
   - MongoDB query sanitization

## Troubleshooting

If you encounter issues during integration:

1. Check the logs for specific error messages
2. Verify that all required dependencies are installed
3. Ensure environment variables are properly set
4. Run `node verify-integration.js` to check for specific issues

For more detailed help, contact the WEAP support team.

## Customization

You can customize the security settings by modifying your environment variables. The following variables are available:

```
JWT_SECRET
JWT_EXPIRATION
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX
FILE_SIZE_LIMIT
ALLOWED_MIME_TYPES
ALLOWED_EXTENSIONS
ALLOWED_ORIGINS
MONGODB_URI
PORT
UPLOAD_DIR
```

If not specified, secure defaults will be used.

## Environment Variables

### Server Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# JWT Authentication
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d

# File Upload
UPLOAD_MAX_SIZE=5242880

# MongoDB
MONGODB_URI=mongodb://localhost:27017/weap
NODE_ENV=development
PORT=5000
```

### Client Environment Variables

Create a `.env` file in the `client` directory with:

```
VITE_API_URL=http://localhost:5000/api
```

## Uploads Directory

The file upload system requires an `uploads` directory. While the enhanced code will create this automatically, you can manually create it to ensure proper permissions:

```bash
mkdir -p server/uploads
chmod 755 server/uploads
```

## MongoDB Setup

1. Install MongoDB if you haven't already: https://www.mongodb.com/docs/manual/installation/
2. Start the MongoDB service
3. The database will be created automatically when the app first connects

## Server Integration

1. Ensure the `enhance.js` file is properly imported in your `server.js`:

```javascript
// Add after initializing your Express app
const enhance = require('./enhance');
enhance(app);
```

2. Verify all required dependencies are installed:

```bash
npm install jsonwebtoken http-errors express-validator mongoose
```

## Client Integration

1. Install required dependencies:

```bash
cd client
npm install axios yup
```

2. Import enhanced components where needed:

```jsx
import { EnhancedContactFormWithAPI } from './components/enhanced/contact/EnhancedContactFormWithAPI';

// Then use in your component
function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <EnhancedContactFormWithAPI />
    </div>
  );
}
```

## Troubleshooting

### Common Issues and Solutions

1. **MongoDB Connection Failure**
   - Check if MongoDB is running
   - Verify the connection string in your `.env` file
   - The enhanced system has fallbacks but database features won't work

2. **Missing Environment Variables**
   - The system provides defaults for most variables, but custom JWT_SECRET is recommended for production

3. **File Upload Issues**
   - Check permissions on the uploads directory
   - Verify file size limits in both client and server settings

4. **API Endpoint Not Found**
   - Ensure the enhance.js is properly imported in server.js
   - Check browser network tab for the actual error

### Integration Verification

Run these checks to verify correct integration:

1. Start the server and check console logs for:
   - "Enhancing application with additional features..."
   - "MongoDB connected successfully for enhanced features"
   - "Enhanced API routes registered successfully"

2. Test the contact form submission
3. Check uploads directory for saved files
4. Verify data is stored in MongoDB 