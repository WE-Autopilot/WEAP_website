import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import * as yup from "yup";

// Define form field interfaces
interface FileData {
  fileName: string;
  fileType: string;
  fileData: string;
}

// Enhanced form hook props
interface UseEnhancedFormProps<T> {
  initialValues: T;
  validationSchema?: yup.ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void> | void;
}

// Hook return type
interface UseEnhancedFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleFileChange: (fileData: FileData | null) => void;
  resetForm: () => void;
  isSubmitting: boolean;
}

/**
 * Enhanced form hook with file upload and validation support
 * @param props Hook props
 * @returns Form handling utilities
 */
function useEnhancedForm<T extends Record<string, any>>(
  props: UseEnhancedFormProps<T>
): UseEnhancedFormReturn<T> {
  const { initialValues, validationSchema, onSubmit } = props;

  // Form state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate field
  const validateField = useCallback(
    async (name: string, value: any) => {
      if (!validationSchema) return;

      try {
        // Create a partial schema for just this field
        const fieldSchema = yup.object().shape({
          [name]: validationSchema.fields[name],
        });

        await fieldSchema.validate({ [name]: value }, { abortEarly: false });

        // Clear error if validation passes
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      } catch (error: any) {
        if (error instanceof yup.ValidationError) {
          // Set validation error
          const fieldErrors: Record<string, string> = {};

          error.inner.forEach((e) => {
            if (e.path) {
              fieldErrors[e.path] = e.message;
            }
          });

          setErrors((prev) => ({
            ...prev,
            ...fieldErrors,
          }));
        }
      }
    },
    [validationSchema]
  );

  // Handle input change
  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target as HTMLInputElement;
      const newValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Validate field after change
      validateField(name, newValue);
    },
    [validateField]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    []
  );

  // Handle file change
  const handleFileChange = useCallback((fileData: FileData | null) => {
    if (fileData) {
      setValues((prev) => ({
        ...prev,
        fileName: fileData.fileName,
        fileType: fileData.fileType,
        fileData: fileData.fileData,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        fileName: null,
        fileType: null,
        fileData: null,
      }));
    }
  }, []);

  // Validate all fields
  const validateForm = useCallback(async () => {
    if (!validationSchema) return true;

    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};

        error.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });

        setErrors(validationErrors);

        // Also set touched for all fields with errors
        setTouched((prev) => {
          const newTouched: Record<string, boolean> = { ...prev };
          Object.keys(validationErrors).forEach((key) => {
            newTouched[key] = true;
          });
          return newTouched;
        });
      }

      return false;
    }
  }, [validationSchema, values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Set all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate form
      const isValid = await validateForm();

      if (isValid) {
        setIsSubmitting(true);

        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleFileChange,
    resetForm,
    isSubmitting,
  };
}

export default useEnhancedForm;
