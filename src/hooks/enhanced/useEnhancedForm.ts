import {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  FocusEvent,
} from "react";
import {
  contactFormSchema,
  validateField,
} from "../../schemas/enhanced/validationSchema";
import { prepareFileForUpload } from "../../utils/enhanced/fileUploadUtils";

type FormErrors = {
  [key: string]: string | null;
};

type FormState = {
  [key: string]: any;
};

interface UseEnhancedFormOptions {
  initialValues?: FormState;
  onSubmit?: (values: FormState) => void | Promise<void>;
  onError?: (errors: FormErrors) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Enhanced form hook for improved validation and error handling
 */
const useEnhancedForm = ({
  initialValues = {},
  onSubmit,
  onError,
  validateOnChange = true,
  validateOnBlur = true,
}: UseEnhancedFormOptions = {}) => {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate all form fields
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await contactFormSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: FormErrors = {};

      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
      }

      setErrors(validationErrors);

      if (onError) {
        onError(validationErrors);
      }

      return false;
    }
  }, [values, onError]);

  // Handle input change
  const handleChange = useCallback(
    async (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = event.target;

      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      if (validateOnChange) {
        const result = await validateField(name as any, value);

        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: result.error,
        }));
      }
    },
    [validateOnChange]
  );

  // Handle input blur
  const handleBlur = useCallback(
    async (
      event: FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = event.target;

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      if (validateOnBlur) {
        const result = await validateField(name as any, value);

        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: result.error,
        }));
      }
    },
    [validateOnBlur]
  );

  // Handle file change
  const handleFileChange = useCallback(
    (
      fileData: { fileName: string; fileType: string; fileData: string } | null
    ) => {
      setValues((prevValues) => ({
        ...prevValues,
        fileName: fileData?.fileName || null,
        fileType: fileData?.fileType || null,
        fileData: fileData?.fileData || null,
      }));

      setTouched((prevTouched) => ({
        ...prevTouched,
        file: true,
      }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (event?: FormEvent) => {
      if (event) {
        event.preventDefault();
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const isValid = await validateForm();

        if (isValid && onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setSubmitError(errorMessage);

        if (onError) {
          onError({ form: errorMessage });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit, onError]
  );

  // Set a specific form value
  const setValue = useCallback(
    (name: string, value: any, shouldValidate = validateOnChange) => {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      if (shouldValidate) {
        validateField(name as any, value).then((result) => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: result.error,
          }));
        });
      }
    },
    [validateOnChange]
  );

  // Reset the form
  const resetForm = useCallback(
    (newValues: FormState = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setSubmitError(null);
    },
    [initialValues]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleFileChange,
    setValue,
    resetForm,
    isSubmitting,
    submitError,
  };
};

export default useEnhancedForm;
