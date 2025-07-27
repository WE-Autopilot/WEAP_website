# Contact Form Integration Example

This document provides a practical example of how to enhance the existing contact form with the new secure file handling and validation features without modifying the original code.

## Client-side Integration

### Original Contact Form Component

Assume your existing contact form looks something like this:

```tsx
// src/components/ContactForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.subject) formErrors.subject = 'Subject is required';
    if (!formData.message) formErrors.message = 'Message is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post('/api/contact', formData);
        setSubmitMessage('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch (error) {
        setSubmitMessage('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label>Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
        />
        {errors.subject && <div className="error">{errors.subject}</div>}
      </div>

      <div className="form-group">
        <label>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        {errors.message && <div className="error">{errors.message}</div>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {submitMessage && <div className="submit-message">{submitMessage}</div>}
    </form>
  );
};

export default ContactForm;
```

### Enhanced Contact Form Component

Create a new enhanced version that uses the new components without modifying the original:

```tsx
// src/components/enhanced/EnhancedContactForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import useEnhancedForm from '../../hooks/enhanced/useEnhancedForm';
import EnhancedFileUpload from '../../components/enhanced/EnhancedFileUpload';
import { contactFormSchema } from '../../schemas/enhanced/validationSchema';

const EnhancedContactForm: React.FC = () => {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleFileChange,
    isSubmitting,
    submitError,
    resetForm
  } = useEnhancedForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      fileName: null,
      fileType: null,
      fileData: null
    },
    onSubmit: async (formValues) => {
      try {
        const response = await axios.post('/api/contact', formValues);
        setSubmitMessage('Message sent successfully!');
        setSubmitSuccess(true);
        resetForm();
      } catch (error: any) {
        setSubmitMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
        setSubmitSuccess(false);
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name*</label>
        <input
          type="text"
          name="name"
          value={values.name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.name && errors.name ? 'input-error' : ''}
        />
        {touched.name && errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={values.email || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.email && errors.email ? 'input-error' : ''}
        />
        {touched.email && errors.email && <div className="error">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label>Subject*</label>
        <input
          type="text"
          name="subject"
          value={values.subject || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.subject && errors.subject ? 'input-error' : ''}
        />
        {touched.subject && errors.subject && <div className="error">{errors.subject}</div>}
      </div>

      <div className="form-group">
        <label>Message*</label>
        <textarea
          name="message"
          value={values.message || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.message && errors.message ? 'input-error' : ''}
        ></textarea>
        {touched.message && errors.message && <div className="error">{errors.message}</div>}
      </div>

      <div className="form-group">
        <EnhancedFileUpload
          label="Attachment"
          onChange={handleFileChange}
          onError={(error) => console.error(error)}
          value={{
            fileName: values.fileName || '',
            fileType: values.fileType || '',
            fileData: values.fileData || ''
          }}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {submitMessage && (
        <div className={`submit-message ${submitSuccess ? 'success' : 'error'}`}>
          {submitMessage}
        </div>
      )}
    </form>
  );
};

export default EnhancedContactForm;
```

## Server-side Integration

### Original Contact Route

Assume your existing contact route looks something like this:

```js
// server/routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      // Your email configuration
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
```

### Enhanced Contact Route

Create a new enhanced route that uses the file validation middleware:

```js
// server/routes/enhanced/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const validateFile = require('../../middleware/enhanced/fileValidation');
const fileUtils = require('../../utils/enhanced/fileUtils');

router.post('/', validateFile({ optional: true }), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Initialize email data
    let emailData = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
    };
    
    // Handle file attachment if present
    let filePath;
    if (req.file) {
      // Save the file
      filePath = await fileUtils.saveBase64File(req.file.data, req.file.name);
      
      // Add attachment to email
      emailData.attachments = [
        {
          filename: req.file.name,
          path: filePath
        }
      ];
      
      // Add file info to email body
      emailData.text += `\n\nAttachment: ${req.file.name}`;
      emailData.html += `<p><strong>Attachment:</strong> ${req.file.name}</p>`;
    }
    
    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      // Your email configuration
    });
    
    await transporter.sendMail(emailData);
    
    // Clean up file after sending
    if (filePath) {
      await fileUtils.deleteFile(filePath);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
```

## Application Integration

To use these enhanced components in your application without modifying existing code, register the enhanced route in your main server file:

```js
// server/index.js or app.js
const express = require('express');
const app = express();

// Existing routes
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Enhanced routes - register at a different path
const enhancedContactRoutes = require('./routes/enhanced/contact');
app.use('/api/enhanced/contact', enhancedContactRoutes);

// ...rest of your server code
```

And in your frontend, you can choose to use either the original or enhanced components:

```jsx
// src/pages/Contact.js
import React from 'react';
import ContactForm from '../components/ContactForm';
import EnhancedContactForm from '../components/enhanced/EnhancedContactForm';

const ContactPage = () => {
  // Toggle between original and enhanced versions
  const useEnhanced = true;

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      {useEnhanced ? <EnhancedContactForm /> : <ContactForm />}
    </div>
  );
};

export default ContactPage;
```

This approach allows you to gradually adopt the enhanced components without disrupting existing functionality. 