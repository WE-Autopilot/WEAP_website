/**
 * Enhanced File Upload Utilities
 * Provides secure file handling capabilities without modifying existing code
 */

// File validation configurations
export const FILE_CONFIG = {
  // Maximum file size in bytes (5MB)
  MAX_SIZE: 5 * 1024 * 1024,

  // Allowed MIME types
  ALLOWED_TYPES: [
    "application/pdf", // PDF
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ],

  // Allowed file extensions
  ALLOWED_EXTENSIONS: [".pdf", ".doc", ".docx"],

  // File name length limit
  MAX_FILENAME_LENGTH: 100,
};

/**
 * Validate a file against security requirements
 * @param file The file to validate
 * @returns Object with validation result and any error message
 */
export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  // Check if file exists
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  // Check file size
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return { valid: false, error: "File size exceeds 5MB limit" };
  }

  // Check file type by MIME type
  if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed",
    };
  }

  // Check file extension
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!FILE_CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error:
        "Invalid file extension. Only .pdf, .doc, and .docx files are allowed",
    };
  }

  // Check filename length
  if (file.name.length > FILE_CONFIG.MAX_FILENAME_LENGTH) {
    return {
      valid: false,
      error: `Filename is too long (maximum ${FILE_CONFIG.MAX_FILENAME_LENGTH} characters)`,
    };
  }

  // Check for potentially malicious file names
  if (
    file.name.includes("..") ||
    file.name.includes("/") ||
    file.name.includes("\\")
  ) {
    return { valid: false, error: "Invalid characters in filename" };
  }

  // All checks passed
  return { valid: true };
};

/**
 * Enhanced file change handler that can be used alongside existing handlers
 * @param file The selected file
 * @param setFileError Function to set any file error message
 * @param onSuccess Optional callback for successful validation
 * @returns True if file is valid, false otherwise
 */
export const handleFileSelection = (
  file: File | null,
  setFileError: (error: string | null) => void,
  onSuccess?: (file: File) => void
): boolean => {
  // Clear previous errors
  setFileError(null);

  // Handle file clearing
  if (!file) {
    return true;
  }

  // Validate file
  const validation = validateFile(file);

  if (!validation.valid) {
    // Handle invalid file
    setFileError(validation.error || "Invalid file");
    return false;
  }

  // File is valid
  if (onSuccess) {
    onSuccess(file);
  }
  return true;
};

/**
 * Read file contents as base64 data for secure transmission
 * @param file The file to read
 * @returns Promise resolving to base64 encoded file data
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Get base64 data from result string
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Enhanced file upload handler with improved security
 * @param file The file to upload
 * @param onProgress Optional progress callback
 * @returns Promise with file data suitable for API submission
 */
export const prepareFileForUpload = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ fileName: string; fileType: string; fileData: string }> => {
  try {
    // Validate file one more time
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || "Invalid file");
    }

    // Convert file to base64
    const fileData = await fileToBase64(file);

    // Simulate progress if callback provided
    if (onProgress) {
      onProgress(100);
    }

    // Return file information for API submission
    return {
      fileName: sanitizeFileName(file.name),
      fileType: file.type,
      fileData: fileData,
    };
  } catch (error) {
    // Handle errors
    const errorMessage =
      error instanceof Error ? error.message : "Error processing file";
    throw error;
  }
};

/**
 * Create a sanitized file name
 * @param originalName The original file name
 * @returns A sanitized version of the file name
 */
export const sanitizeFileName = (originalName: string): string => {
  // Remove potentially dangerous characters
  const sanitized = originalName
    .replace(/[/\\?%*:|"<>]/g, "-") // Replace unsafe characters with dash
    .replace(/\s+/g, "_") // Replace spaces with underscore
    .replace(/\.{2,}/g, ".") // Replace multiple dots with single dot
    .trim();

  // Ensure file name isn't too long
  return sanitized.slice(0, FILE_CONFIG.MAX_FILENAME_LENGTH);
};
