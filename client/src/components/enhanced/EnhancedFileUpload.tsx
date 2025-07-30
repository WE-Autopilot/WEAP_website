import React, { useState, useRef, ChangeEvent } from "react";

// File validation utilities
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "text/plain",
];

// File data interface
interface FileData {
  fileName: string;
  fileType: string;
  fileData: string;
}

// Component props
interface EnhancedFileUploadProps {
  label?: string;
  onChange: (fileData: FileData | null) => void;
  onError: (error: string | null) => void;
  value: FileData | null;
  allowedTypes?: string[];
  maxSize?: number;
}

// Styles
const styles = {
  container: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold" as const,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  fileInput: {
    display: "none",
  },
  browseButton: {
    padding: "8px 15px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  fileNameDisplay: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  removeButton: {
    padding: "5px 10px",
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    marginLeft: "10px",
    cursor: "pointer",
  },
  helperText: {
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
};

/**
 * Enhanced File Upload Component
 * Provides secure file upload with validation
 */
const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  label = "File Attachment",
  onChange,
  onError,
  value,
  allowedTypes = ALLOWED_FILE_TYPES,
  maxSize = FILE_SIZE_LIMIT,
}) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format allowed types for display
  const formatAllowedTypes = () => {
    return allowedTypes
      .map((type) => type.split("/")[1])
      .join(", ")
      .replace("jpeg", "jpg");
  };

  // Format file size for display
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const errorMessage = `Invalid file type. Allowed types: ${formatAllowedTypes()}`;
      setError(errorMessage);
      onError(errorMessage);
      e.target.value = "";
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const errorMessage = `File size exceeds the limit of ${formatFileSize(
        maxSize
      )}`;
      setError(errorMessage);
      onError(errorMessage);
      e.target.value = "";
      return;
    }

    // Clear previous errors
    setError(null);
    onError(null);

    // Read file as base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];

      onChange({
        fileName: file.name,
        fileType: file.type,
        fileData: base64Data,
      });
    };

    reader.onerror = () => {
      setError("Error reading file");
      onError("Error reading file");
    };

    reader.readAsDataURL(file);
  };

  // Handle remove file
  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onChange(null);
    setError(null);
    onError(null);
  };

  // Handle browse click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>

      <div style={styles.inputContainer}>
        <input
          type="file"
          ref={fileInputRef}
          style={styles.fileInput}
          onChange={handleFileChange}
          accept={allowedTypes.join(",")}
        />

        <button
          type="button"
          onClick={handleBrowseClick}
          style={styles.browseButton}
        >
          Browse...
        </button>

        <div style={styles.fileNameDisplay}>
          {value ? value.fileName : "No file selected"}
        </div>

        {value && (
          <button
            type="button"
            onClick={handleRemoveFile}
            style={styles.removeButton}
          >
            Remove
          </button>
        )}
      </div>

      <div style={styles.helperText}>
        Allowed types: {formatAllowedTypes()}. Maximum size:{" "}
        {formatFileSize(maxSize)}
      </div>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

export default EnhancedFileUpload;
