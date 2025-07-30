/**
 * Contact Controller
 * Handles all contact-related business logic
 */
const Contact = require("../models/Contact");
const { validationResult } = require("express-validator");
const fileUtils = require("../utils/enhanced/fileUtils");

/**
 * Get all contacts
 * @route GET /api/contacts
 * @access Private (should be restricted to admins)
 */
exports.getContacts = async (req, res) => {
  try {
    // Support pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Support filtering by status
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get contacts with pagination
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: contacts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Get single contact by ID
 * @route GET /api/contacts/:id
 * @access Private (should be restricted to admins)
 */
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Create new contact submission
 * @route POST /api/contacts
 * @access Public
 */
exports.createContact = async (req, res) => {
  try {
    // Check for validation errors from express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors.array(),
      });
    }

    // Extract client IP and user agent
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Process file if available
    let filePath = null;
    if (req.file) {
      // Save the file to the uploads directory
      filePath = await fileUtils.saveBase64File(req.file.data, req.file.name);
    }

    // Prepare contact data
    const contactData = {
      ...req.body,
      ipAddress,
      userAgent,
    };

    // Add file details if a file was uploaded
    if (filePath) {
      contactData.filePath = filePath;
      contactData.fileName = req.file.name;
      contactData.fileType = req.file.type;
      contactData.fileSize = req.file.size;
    }

    // Create contact in database
    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Update contact status by ID
 * @route PATCH /api/contacts/:id/status
 * @access Private (should be restricted to admins)
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status || !["new", "read", "responded", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Find contact
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Update status
    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * Delete contact by ID
 * @route DELETE /api/contacts/:id
 * @access Private (should be restricted to admins)
 */
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Delete associated file if exists
    if (contact.filePath) {
      try {
        await fileUtils.deleteFile(contact.filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue deletion even if file removal fails
      }
    }

    // Delete the contact
    await contact.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
