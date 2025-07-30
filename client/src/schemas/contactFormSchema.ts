import * as yup from "yup";

/**
 * Contact form validation schema
 * Matches server-side validation
 */
const contactFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email address")
    .max(100, "Email cannot exceed 100 characters"),

  phone: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
      "Please provide a valid phone number"
    )
    .max(20, "Phone number cannot exceed 20 characters"),

  subject: yup
    .string()
    .required("Subject is required")
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject cannot exceed 100 characters"),

  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),

  // File fields are handled separately by the file upload component
  fileName: yup.string().nullable(),
  fileType: yup.string().nullable(),
  fileData: yup.string().nullable(),
});

export default contactFormSchema;
