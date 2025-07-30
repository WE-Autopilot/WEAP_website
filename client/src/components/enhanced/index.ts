/**
 * Enhanced Components Index
 *
 * This file exports all enhanced components for easy integration
 * without modifying existing code.
 */

// Export enhanced components
export { default as EnhancedFileUpload } from "./EnhancedFileUpload";
export { default as EnhancedContactForm } from "./contact/EnhancedContactFormWithAPI";

// Export hooks
export { default as useEnhancedForm } from "../hooks/enhanced/useEnhancedForm";

// Export services
export { default as contactService } from "../services/contactService";
