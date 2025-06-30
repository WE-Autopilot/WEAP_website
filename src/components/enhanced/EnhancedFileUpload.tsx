import React, { useState, useRef, useEffect } from "react";
import {
  validateFile,
  handleFileSelection,
  prepareFileForUpload,
} from "../../utils/enhanced/fileUploadUtils";
import { ValidationMessages } from "../../schemas/enhanced/validationSchema";
import "./EnhancedFileUpload.css";

interface EnhancedFileUploadProps {
  onChange?: (
    fileData: { fileName: string; fileType: string; fileData: string } | null
  ) => void;
  onError?: (error: string | null) => void;
  value?: { fileName: string; fileType: string; fileData: string } | null;
  label?: string;
  accept?: string;
  required?: boolean;
  maxSizeMB?: number;
  className?: string;
  buttonText?: string;
  clearButtonText?: string;
  showPreview?: boolean;
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onChange,
  onError,
  value,
  label = "Upload File",
  accept = ".pdf,.doc,.docx",
  required = false,
  maxSizeMB = 5,
  className = "",
  buttonText = "Choose File",
  clearButtonText = "Clear",
  showPreview = true,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle initial value
  useEffect(() => {
    if (value && value.fileName) {
      setFileName(value.fileName);
    }
  }, [value]);

  // Handle file input change
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    // Reset states
    setFile(selectedFile);
    setUploadProgress(0);

    if (!selectedFile) {
      setFileName("");
      setFileError(null);
      if (onChange) onChange(null);
      return;
    }

    // Validate and handle file selection
    const isValid = handleFileSelection(
      selectedFile,
      (error) => {
        setFileError(error);
        if (onError) onError(error);
      },
      (validFile) => {
        setFileName(validFile.name);
        processFile(validFile);
      }
    );

    if (!isValid) {
      if (onChange) onChange(null);
    }
  };

  // Process the file for upload
  const processFile = async (selectedFile: File) => {
    try {
      setIsUploading(true);

      // Prepare file for upload with progress tracking
      const fileData = await prepareFileForUpload(
        selectedFile,
        setUploadProgress
      );

      // Pass the prepared file data to parent component
      if (onChange) {
        onChange(fileData);
      }

      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);

      // Handle error
      const errorMessage =
        error instanceof Error ? error.message : "Error processing file";
      setFileError(errorMessage);
      if (onError) onError(errorMessage);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Clear the selected file
  const handleClearFile = () => {
    setFile(null);
    setFileName("");
    setFileError(null);
    setUploadProgress(0);

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Notify parent component
    if (onChange) {
      onChange(null);
    }

    if (onError) {
      onError(null);
    }
  };

  // Generate class name for the container based on error state
  const getContainerClassName = () => {
    let baseClass = "enhanced-file-upload";

    if (className) {
      baseClass += ` ${className}`;
    }

    if (fileError) {
      baseClass += " enhanced-file-upload--error";
    }

    return baseClass;
  };

  return (
    <div className={getContainerClassName()}>
      {label && (
        <label className="enhanced-file-upload__label">
          {label}
          {required && (
            <span className="enhanced-file-upload__required">*</span>
          )}
        </label>
      )}

      <div className="enhanced-file-upload__input-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="enhanced-file-upload__input"
          disabled={isUploading}
        />

        <div className="enhanced-file-upload__controls">
          <button
            type="button"
            className="enhanced-file-upload__button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {buttonText}
          </button>

          {fileName && (
            <button
              type="button"
              className="enhanced-file-upload__clear-button"
              onClick={handleClearFile}
              disabled={isUploading}
            >
              {clearButtonText}
            </button>
          )}
        </div>

        {fileName && (
          <div className="enhanced-file-upload__file-info">
            <span className="enhanced-file-upload__file-name">{fileName}</span>
          </div>
        )}

        {isUploading && (
          <div className="enhanced-file-upload__progress-container">
            <div
              className="enhanced-file-upload__progress-bar"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="enhanced-file-upload__progress-text">
              {uploadProgress}%
            </span>
          </div>
        )}

        {fileError && (
          <div className="enhanced-file-upload__error-message">{fileError}</div>
        )}

        {showPreview && fileName && value?.fileData && (
          <div className="enhanced-file-upload__preview">
            {value.fileType.includes("pdf") && (
              <div className="enhanced-file-upload__pdf-preview">
                PDF Preview Available
              </div>
            )}
            {value.fileType.includes("word") && (
              <div className="enhanced-file-upload__doc-preview">
                Document Preview Available
              </div>
            )}
          </div>
        )}

        <div className="enhanced-file-upload__help-text">
          {ValidationMessages.fileSize} • {ValidationMessages.fileType}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFileUpload;
