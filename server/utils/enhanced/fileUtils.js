/**
 * Enhanced File Utilities
 * Provides secure file handling functions
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { promisify } = require("util");

// Convert callback-based fs functions to promise-based
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

// Default upload directory (create it if it doesn't exist)
// Simplify the path to reference the uploads directory directly from server root
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Create uploads directory if it doesn't exist
const ensureUploadDirExists = async () => {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      await mkdirAsync(UPLOAD_DIR, { recursive: true });
      console.log("Created upload directory:", UPLOAD_DIR);
    }
    return UPLOAD_DIR;
  } catch (error) {
    console.error("Error creating upload directory:", error);
    throw new Error("Failed to create upload directory");
  }
};

/**
 * Generate a secure filename to prevent path traversal attacks
 * @param {string} originalName Original filename
 * @returns {string} Secure filename
 */
const generateSecureFilename = (originalName) => {
  // Get file extension
  const ext = path.extname(originalName).toLowerCase();

  // Generate random filename with original extension
  const randomName = crypto.randomBytes(16).toString("hex");

  return `${randomName}${ext}`;
};

/**
 * Save Base64 encoded file
 * @param {string} base64Data Base64 encoded file data
 * @param {string} fileName Original filename
 * @returns {Promise<string>} Path to saved file
 */
exports.saveBase64File = async (base64Data, fileName) => {
  try {
    const uploadDir = await ensureUploadDirExists();

    // Generate secure filename
    const secureFilename = generateSecureFilename(fileName);
    const filePath = path.join(uploadDir, secureFilename);

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64Data, "base64");

    // Write file
    await writeFileAsync(filePath, fileBuffer);

    return filePath;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
};

/**
 * Delete file
 * @param {string} filePath Path to file
 * @returns {Promise<void>}
 */
exports.deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
};

/**
 * Sanitize filename to prevent path traversal attacks
 * @param {string} fileName Original filename
 * @returns {string} Sanitized filename
 */
exports.sanitizeFilename = (fileName) => {
  // Remove any path information and invalid characters
  const sanitized = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");

  return sanitized;
};

/**
 * Get safe file extension
 * @param {string} fileName Original filename
 * @returns {string} File extension
 */
exports.getFileExtension = (fileName) => {
  return path.extname(fileName).toLowerCase();
};

/**
 * Validate file type against allowed types
 * @param {string} fileType MIME type
 * @param {Array<string>} allowedTypes Allowed MIME types
 * @returns {boolean} Whether file type is allowed
 */
exports.validateFileType = (fileType, allowedTypes) => {
  return allowedTypes.includes(fileType);
};

/**
 * Validate file size
 * @param {number} fileSize File size in bytes
 * @param {number} maxSize Maximum allowed size in bytes
 * @returns {boolean} Whether file size is allowed
 */
exports.validateFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize;
};

module.exports = {
  saveBase64File: exports.saveBase64File,
  deleteFile: exports.deleteFile,
  sanitizeFilename: exports.sanitizeFilename,
  getFileExtension: exports.getFileExtension,
  validateFileType: exports.validateFileType,
  validateFileSize: exports.validateFileSize,
  ensureUploadDirExists,
};
