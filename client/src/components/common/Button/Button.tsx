import React from "react";
import "./Button.css";
import {
  colors,
  typography,
  spacing,
  transitions,
} from "../../../styles/tokens";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  ...rest
}) => {
  const baseClasses = "btn";
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const widthClasses = isFullWidth ? "btn-full-width" : "";
  const stateClasses = isLoading ? "btn-loading" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${stateClasses} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <span className="btn-spinner" />}
      {!isLoading && leftIcon && (
        <span className="btn-left-icon">{leftIcon}</span>
      )}
      <span className="btn-text">{children}</span>
      {!isLoading && rightIcon && (
        <span className="btn-right-icon">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
