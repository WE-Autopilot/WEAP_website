/**
 * Enhanced Form Validation Schema
 * Provides consistent validation between client and server
 */
import * as yup from "yup";
import { FILE_CONFIG } from "../../utils/enhanced/fileUploadUtils";

// Common validation error messages
export const ValidationMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  fileSize: `File size should not exceed ${
    FILE_CONFIG.MAX_SIZE / (1024 * 1024)
  }MB`,
  fileType: "Only PDF, DOC, and DOCX files are allowed",
};

// Enhanced contact form validation schema
export const contactFormSchema = yup.object().shape({
  name: yup
    .string()
    .required(ValidationMessages.required)
    .min(2, ValidationMessages.minLength(2))
    .max(100, ValidationMessages.maxLength(100)),

  email: yup
    .string()
    .required(ValidationMessages.required)
    .email(ValidationMessages.email)
    .max(100, ValidationMessages.maxLength(100)),

  phone: yup
    .string()
    .matches(
      /^(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
      ValidationMessages.phone
    )
    .max(20, ValidationMessages.maxLength(20)),

  subject: yup
    .string()
    .required(ValidationMessages.required)
    .min(2, ValidationMessages.minLength(2))
    .max(100, ValidationMessages.maxLength(100)),

  message: yup
    .string()
    .required(ValidationMessages.required)
    .min(10, ValidationMessages.minLength(10))
    .max(1000, ValidationMessages.maxLength(1000)),

  // File validation is handled separately with the fileUploadUtils
  // but we include basic validation here for completeness
  fileData: yup.string().nullable(),
  fileName: yup.string().nullable(),
  fileType: yup.string().nullable(),
});

/**
 * Validate a single field with the contact form schema
 * @param field The field name to validate
 * @param value The field value to validate
 * @returns Validation result with any error message
 */
export const validateField = async (
  field: keyof yup.InferType<typeof contactFormSchema>,
  value: any
): Promise<{ valid: boolean; error: string | null }> => {
  try {
    // Create a partial schema for just this field
    const fieldSchema = yup.object().shape({
      [field]: contactFormSchema.fields[field],
    });

    // Validate just this field
    await fieldSchema.validate({ [field]: value }, { abortEarly: false });

    return { valid: true, error: null };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // Get the first error message for this field
      const fieldError = error.inner.find((err) => err.path === field);
      return { valid: false, error: fieldError?.message || "Invalid value" };
    }

    return { valid: false, error: "Validation error" };
  }
};

/**
 * Generate server-compatible validation schema
 * This can be exported to a JSON file that the server can import
 * to ensure validation is consistent
 */
export const getServerValidationRules = () => {
  // Convert Yup schema to a more portable format
  return {
    name: { required: true, min: 2, max: 100 },
    email: { required: true, email: true, max: 100 },
    phone: {
      required: false,
      pattern: /^(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
      max: 20,
    },
    subject: { required: true, min: 2, max: 100 },
    message: { required: true, min: 10, max: 1000 },
    file: {
      required: false,
      maxSize: FILE_CONFIG.MAX_SIZE,
      allowedTypes: FILE_CONFIG.ALLOWED_TYPES,
      allowedExtensions: FILE_CONFIG.ALLOWED_EXTENSIONS,
    },
  };
};
