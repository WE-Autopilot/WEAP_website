import React, { useState } from "react";
import useEnhancedForm from "../../../hooks/enhanced/useEnhancedForm";
import EnhancedFileUpload from "../EnhancedFileUpload";
import contactService, {
  ContactFormData,
} from "../../../services/contactService";
import contactFormSchema from "../../../schemas/contactFormSchema";

// Styles for the form
const styles = {
  form: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold" as const,
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    minHeight: "150px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  successMessage: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "4px",
  },
  errorMessage: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "4px",
  },
};

/**
 * Enhanced Contact Form Component with Real API Integration
 */
const EnhancedContactFormWithAPI: React.FC = () => {
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
    resetForm,
  } = useEnhancedForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      fileName: null,
      fileType: null,
      fileData: null,
    },
    validationSchema: contactFormSchema,
    onSubmit: async (formValues: ContactFormData) => {
      try {
        // Submit to real API
        const response = await contactService.submitContact(formValues);

        if (response.success) {
          setSubmitMessage(
            "Your message has been sent successfully! We will get back to you soon."
          );
          setSubmitSuccess(true);
          resetForm();
        } else {
          setSubmitMessage(
            response.message || "Failed to send message. Please try again."
          );
          setSubmitSuccess(false);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.";
        setSubmitMessage(errorMessage);
        setSubmitSuccess(false);
      }
    },
  });

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Contact Us</h2>
      <p>
        Please fill out the form below to get in touch with us. Fields marked
        with * are required.
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Name*</label>
        <input
          type="text"
          name="name"
          value={values.name || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            ...styles.input,
            ...(touched.name && errors.name ? { border: "1px solid red" } : {}),
          }}
        />
        {touched.name && errors.name && (
          <div style={styles.error}>{errors.name}</div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email*</label>
        <input
          type="email"
          name="email"
          value={values.email || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            ...styles.input,
            ...(touched.email && errors.email
              ? { border: "1px solid red" }
              : {}),
          }}
        />
        {touched.email && errors.email && (
          <div style={styles.error}>{errors.email}</div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Phone (optional)</label>
        <input
          type="tel"
          name="phone"
          value={values.phone || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            ...styles.input,
            ...(touched.phone && errors.phone
              ? { border: "1px solid red" }
              : {}),
          }}
        />
        {touched.phone && errors.phone && (
          <div style={styles.error}>{errors.phone}</div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Subject*</label>
        <input
          type="text"
          name="subject"
          value={values.subject || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            ...styles.input,
            ...(touched.subject && errors.subject
              ? { border: "1px solid red" }
              : {}),
          }}
        />
        {touched.subject && errors.subject && (
          <div style={styles.error}>{errors.subject}</div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Message*</label>
        <textarea
          name="message"
          value={values.message || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            ...styles.textarea,
            ...(touched.message && errors.message
              ? { border: "1px solid red" }
              : {}),
          }}
        ></textarea>
        {touched.message && errors.message && (
          <div style={styles.error}>{errors.message}</div>
        )}
      </div>

      <div style={styles.formGroup}>
        <EnhancedFileUpload
          label="Attachment (optional)"
          onChange={handleFileChange}
          onError={(error: string | null) => console.error(error)}
          value={
            values.fileName
              ? {
                  fileName: values.fileName,
                  fileType: values.fileType || "",
                  fileData: values.fileData || "",
                }
              : null
          }
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          ...styles.button,
          ...(isSubmitting ? styles.buttonDisabled : {}),
        }}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {submitMessage && (
        <div
          style={submitSuccess ? styles.successMessage : styles.errorMessage}
        >
          {submitMessage}
        </div>
      )}
    </form>
  );
};

export default EnhancedContactFormWithAPI;
