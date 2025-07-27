# Enhanced Components and Utilities

This documentation describes the enhanced components and utilities that have been added to the WEAP website to improve security, validation, and user experience without modifying the existing codebase.

## Table of Contents

1. [File Upload Handling](#file-upload-handling)
2. [Form Validation](#form-validation)
3. [Server-side Integration](#server-side-integration)
4. [Usage Examples](#usage-examples)

## File Upload Handling

### Client-side File Handling

Enhanced file handling utilities are provided in `src/utils/enhanced/fileUploadUtils.ts`. These utilities include:

- File validation for size, type, and extension
- Secure file name sanitization
- Base64 conversion for secure transmission
- Progress tracking during file processing

The `EnhancedFileUpload` component in `src/components/enhanced/EnhancedFileUpload.tsx` provides a complete UI for file uploads with:

- Visual feedback for file selection
- Error messaging for invalid files
- Upload progress indication
- Preview capabilities for supported file types

### Server-side File Handling

Server-side file handling utilities are provided in `server/utils/enhanced/fileUtils.js`. These utilities include:

- Secure file name sanitization to prevent path traversal attacks
- Unique file name generation to prevent overwriting
- Base64 file decoding and secure storage
- Secure file deletion and existence checking

## Form Validation

### Client-side Validation

Enhanced form validation is provided through:

- Validation schemas in `src/schemas/enhanced/validationSchema.ts`
- A form hook in `src/hooks/enhanced/useEnhancedForm.ts`

The validation schema uses Yup to define validation rules that can be shared between client and server. The form hook provides:

- Field-level validation on change and blur
- Form-level validation on submit
- Error tracking per field
- Support for file uploads

### Server-side Validation

Server-side validation is provided through middleware in `server/middleware/enhanced/fileValidation.js`. This middleware:

- Validates file uploads against size, type, and extension constraints
- Sanitizes file names to prevent security issues
- Parses base64 file data for secure storage

## Usage Examples

### Using the Enhanced File Upload Component

```tsx
import EnhancedFileUpload from '../../components/enhanced/EnhancedFileUpload';

// In your component
const [fileData, setFileData] = useState(null);
const [fileError, setFileError] = useState(null);

// In your render method
<EnhancedFileUpload
  label="Upload Resume"
  required={true}
  onChange={setFileData}
  onError={setFileError}
  value={fileData}
/>
```

### Using the Enhanced Form Hook

```tsx
import useEnhancedForm from '../../hooks/enhanced/useEnhancedForm';

// In your component
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  handleFileChange,
  isSubmitting,
  submitError
} = useEnhancedForm({
  initialValues: {
    name: '',
    email: '',
    message: ''
  },
  onSubmit: async (formValues) => {
    // Submit form data to your API
    await api.contact.submit(formValues);
  }
});

// In your render method
<form onSubmit={handleSubmit}>
  <div>
    <label>Name</label>
    <input
      type="text"
      name="name"
      value={values.name || ''}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    {touched.name && errors.name && <div className="error">{errors.name}</div>}
  </div>
  
  {/* More form fields */}
  
  <EnhancedFileUpload
    label="Attachment"
    onChange={handleFileChange}
    onError={(error) => errors.file = error}
  />
  
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
  
  {submitError && <div className="error">{submitError}</div>}
</form>
```

### Using Server-side File Validation

```js
const express = require('express');
const router = express.Router();
const validateFile = require('../middleware/enhanced/fileValidation');
const fileUtils = require('../utils/enhanced/fileUtils');

// Route with optional file upload
router.post('/contact', validateFile({ optional: true }), async (req, res, next) => {
  try {
    // Process form data
    const { name, email, message } = req.body;
    
    // If a file was uploaded and validated
    if (req.file) {
      // Save the file
      const filePath = await fileUtils.saveBase64File(req.file.data, req.file.name);
      
      // Store file path in database or include in email
      // ...
    }
    
    // Send response
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

## Integration with Existing Code

These enhanced components and utilities are designed to work alongside existing code without modification. They can be imported and used where needed, gradually replacing or enhancing the existing functionality.

For example, to enhance an existing form component:

```tsx
// Import the enhanced hook
import useEnhancedForm from '../../hooks/enhanced/useEnhancedForm';

// In your existing component
function ExistingForm() {
  // Add the enhanced form hook
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    // ...other properties
  } = useEnhancedForm({
    initialValues: {
      // Initialize with existing form state
    },
    onSubmit: async (values) => {
      // Use your existing submit logic
    }
  });
  
  // Use your existing render method, but with enhanced handlers
  // ...
}
```

This approach allows for incremental adoption of the enhanced functionality without breaking existing code. 