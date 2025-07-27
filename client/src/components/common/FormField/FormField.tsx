import React from "react";
import "./FormField.css";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: InputType;
  value: string | number | boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  helpText,
  min,
  max,
  step,
  options = [],
  children,
}) => {
  const showError = touched && error;
  const inputClassName = `form-control ${
    showError ? "is-invalid" : ""
  } ${className}`;

  const renderField = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={id}
          name={name}
          className={inputClassName}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={5}
        />
      );
    }

    if (type === "select") {
      return (
        <select
          id={id}
          name={name}
          className={inputClassName}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      );
    }

    if (type === "checkbox") {
      return (
        <div className="form-check">
          <input
            id={id}
            name={name}
            type="checkbox"
            className={`form-check-input ${className}`}
            checked={value as boolean}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
          />
          <label htmlFor={id} className="form-check-label">
            {label}
          </label>
        </div>
      );
    }

    if (type === "radio") {
      return (
        <div className="form-check">
          <input
            id={id}
            name={name}
            type="radio"
            className={`form-check-input ${className}`}
            checked={value as boolean}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
          />
          <label htmlFor={id} className="form-check-label">
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        id={id}
        name={name}
        type={type}
        className={inputClassName}
        value={value as string}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />
    );
  };

  // For checkbox and radio types, we already render the label with the input
  if (type === "checkbox" || type === "radio") {
    return (
      <div className="form-group">
        {renderField()}
        {showError && <div className="form-error">{error}</div>}
        {helpText && <div className="form-text">{helpText}</div>}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      {renderField()}
      {showError && <div className="form-error">{error}</div>}
      {helpText && <div className="form-text">{helpText}</div>}
    </div>
  );
};

export default FormField;
