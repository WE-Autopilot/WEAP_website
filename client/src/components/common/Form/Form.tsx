import React, { FormEvent, useState } from "react";
import { ZodSchema } from "zod";
import "./Form.css";
import { Button } from "..";

interface FormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validationSchema?: ZodSchema<T>;
  children: (formProps: FormChildrenProps<T>) => React.ReactNode;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
}

export interface FormChildrenProps<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  resetForm: () => void;
}

function Form<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  submitLabel = "Submit",
  resetLabel = "Reset",
  showReset = true,
  className = "",
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (
    fieldValues: Partial<T> = values
  ): Record<string, string> => {
    if (!validationSchema) return {};

    try {
      validationSchema.parse(fieldValues);
      return {};
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          formattedErrors[path] = err.message;
        });
      }
      return formattedErrors;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setValues({ ...values, [name]: newValue });
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    if (validationSchema) {
      const fieldValidationErrors = validate({ ...values });
      setErrors(fieldValidationErrors);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationSchema) {
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce<Record<string, boolean>>(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {}
      );
      setTouched(allTouched);

      const validationErrors = validate();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`form ${className}`} noValidate>
      {children({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        resetForm,
      })}

      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>

        {showReset && (
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            {resetLabel}
          </Button>
        )}
      </div>
    </form>
  );
}

export default Form;
