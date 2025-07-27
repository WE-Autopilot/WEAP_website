/**
 * Enhanced File Validation Middleware
 * Provides secure file upload validation
 */
const fileUtils = require("../../utils/enhanced/fileUtils");
const createError = require("http-errors");

// Default configuration
const DEFAULT_CONFIG = {
  maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ],
  optional: true,
};

/**
 * Validates file uploads - supports both multer files and base64 encoded files
 * @param {Object} options Validation options
 * @returns {Function} Express middleware
 */
const validateFile = (options = {}) => {
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
  };

  return (req, res, next) => {
    try {
      // Check for base64 encoded file (from enhanced components)
      if (
        req.body &&
        req.body.fileData &&
        req.body.fileName &&
        req.body.fileType
      ) {
        // Convert to expected format for controller
        req.file = {
          name: req.body.fileName,
          type: req.body.fileType,
          data: req.body.fileData,
          size: req.body.fileData.length * 0.75, // Approximate size from base64
        };

        // Remove from body to avoid duplication
        delete req.body.fileData;
        delete req.body.fileName;
        delete req.body.fileType;

        console.log("Processed base64 encoded file:", req.file.name);
      }

      // Handle multer file if present (from traditional forms)
      if (req.files && req.files.length > 0) {
        const file = req.files[0];
        req.file = {
          name: file.originalname,
          type: file.mimetype,
          data: file.buffer.toString("base64"),
          size: file.size,
        };
        console.log("Processed multer file:", req.file.name);
      } else if (req.file && !req.file.data) {
        // Handle case where multer provides a different format
        const file = req.file;
        req.file = {
          name: file.originalname || file.filename,
          type: file.mimetype,
          data: file.buffer ? file.buffer.toString("base64") : "",
          size: file.size,
        };
        console.log("Processed alternate multer format:", req.file.name);
      }

      // If no file provided and file is optional, skip validation
      if (!req.file && config.optional) {
        console.log("No file provided, but optional=true, skipping validation");
        return next();
      }

      // If file is required but not provided, return error
      if (!req.file && !config.optional) {
        console.log("File is required but not provided");
        return next(createError(400, "File is required"));
      }

      // If file provided, validate it
      if (req.file) {
        // Validate file type
        if (!fileUtils.validateFileType(req.file.type, config.allowedTypes)) {
          console.log("Invalid file type:", req.file.type);
          return next(
            createError(
              400,
              `Invalid file type. Allowed types: ${config.allowedTypes.join(
                ", "
              )}`
            )
          );
        }

        // Validate file size
        if (!fileUtils.validateFileSize(req.file.size, config.maxSize)) {
          console.log("File size exceeds the limit:", req.file.size);
          return next(
            createError(
              400,
              `File size exceeds the limit of ${config.maxSize} bytes`
            )
          );
        }

        // Sanitize file name
        req.file.name = fileUtils.sanitizeFilename(req.file.name);
        console.log("File validation successful:", req.file.name);
      }

      next();
    } catch (error) {
      console.error("File validation error:", error);
      next(createError(500, "Error validating file"));
    }
  };
};

module.exports = validateFile;
