/**
 * Enhanced Contact Route
 * Provides secure file handling for contact form submissions
 */
const express = require("express");
const router = express.Router();
const validateFile = require("../../middleware/enhanced/fileValidation");
const fileUtils = require("../../utils/enhanced/fileUtils");

// Use optional file validation middleware
router.post("/", validateFile({ optional: true }), async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Initialize email data (actual email sending would be implemented here)
    let emailData = {
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: process.env.EMAIL_TO || "contact@example.com",
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    };

    // Handle file attachment if present
    let filePath;
    if (req.file) {
      try {
        // Save the file
        filePath = await fileUtils.saveBase64File(req.file.data, req.file.name);

        // Add file info to response (in a real implementation, this would be added to email)
        console.log(`File saved at: ${filePath}`);

        // Clean up file after processing
        // In a real implementation, this would happen after the email is sent
        await fileUtils.deleteFile(filePath);
      } catch (fileError) {
        console.error("File processing error:", fileError);
        // Continue processing the form even if file handling fails
      }
    }

    // For demonstration purposes, log the data we would send
    console.log("Contact form data received:", {
      name,
      email,
      subject,
      message,
      hasAttachment: !!req.file,
    });

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Message received successfully",
      hasAttachment: !!req.file,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to process message" });
  }
});

module.exports = router;
