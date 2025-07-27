import React from "react";
import "./Spinner.css";

export interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white";
  fullPage?: boolean;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "primary",
  fullPage = false,
  label,
}) => {
  const containerClassName = fullPage
    ? "spinner-container spinner-fullpage"
    : "spinner-container";

  return (
    <div className={containerClassName} role="status" aria-live="polite">
      <div className={`spinner spinner-${size} spinner-${color}`}>
        <div className="spinner-inner"></div>
      </div>
      {label && <p className="spinner-label">{label}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
