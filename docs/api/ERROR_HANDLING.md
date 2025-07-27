# Enhanced Server Error Handling

This utility provides improved error handling for the server without modifying the existing error handler.

## Quick Start

To use the enhanced error handling, follow these steps:

1. **Create a new route with enhanced error handling:**

```javascript
// server/routes/api/example.js
const express = require('express');
const router = express.Router();
const { createNotFoundError } = require('../../utils/enhancedErrorHandler');

// Example route with enhanced error handling
router.get('/:id', async (req, res, next) => {
  try {
    const item = await SomeModel.findById(req.params.id);
    
    if (!item) {
      // Use enhanced error
      return next(createNotFoundError(`Item with ID ${req.params.id} not found`));
    }
    
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

2. **Use the enhanced error middleware in a route:**

```javascript
// server/routes/api/secure.js
const express = require('express');
const router = express.Router();
const { enhancedErrorMiddleware } = require('../../utils/enhancedErrorHandler');

// Regular routes
router.get('/items', (req, res) => {
  res.json({ success: true, data: [] });
});

// Apply enhanced error handling just to this router
router.use(enhancedErrorMiddleware);

module.exports = router;
```

3. **Create custom error types:**

```javascript
const { 
  createValidationError,
  createAuthenticationError,
  createAuthorizationError,
  createNotFoundError,
  createConflictError,
  createServerError
} = require('../../utils/enhancedErrorHandler');

// Validation error with details
const validationError = createValidationError(
  'Invalid data provided',
  [
    { field: 'email', message: 'Invalid email format' },
    { field: 'password', message: 'Password too short' }
  ]
);

// Authentication error
const authError = createAuthenticationError('Please log in to continue');

// Resource not found
const notFoundError = createNotFoundError('User not found');
```

## Available Error Types

The enhanced error handler provides these error factory functions:

- `createValidationError(message, details)` - For invalid input data (400)
- `createAuthenticationError(message)` - For authentication failures (401)
- `createAuthorizationError(message)` - For permission issues (403)
- `createNotFoundError(message)` - For missing resources (404)
- `createConflictError(message, details)` - For conflicts like duplicates (409)
- `createServerError(message)` - For internal server errors (500)

## Benefits

1. **Consistent error format** - All errors follow the same structure
2. **Type-based errors** - Errors are categorized by type
3. **Better client integration** - Error format matches client-side error handling
4. **Detailed error information** - Includes timestamps, details, and stack traces in development
5. **Works alongside existing code** - No need to modify current error handling

## Implementation Details

The enhanced error handling is implemented in `utils/enhancedErrorHandler.js` and includes:

- `EnhancedError` class - Extended Error class with additional properties
- `ErrorTypes` object - Constants for different error types
- `enhancedErrorMiddleware` - Express middleware for handling errors
- Error factory functions - For creating specific types of errors

This implementation works alongside the existing error handler without modifying it. 