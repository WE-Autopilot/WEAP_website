import React from "react";
import { logError } from "../../utils/errorUtils";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Error fallback component for use with react-error-boundary
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  // Log error when fallback is shown
  React.useEffect(() => {
    logError(error, "error_boundary_fallback");
  }, [error]);

  return (
    <div role="alert" className="enhanced-error-fallback">
      <div className="error-content">
        <h2>Something went wrong</h2>
        <p>{error.message || "An unexpected error occurred"}</p>
        <div className="error-actions">
          <button onClick={resetErrorBoundary} className="retry-button">
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="home-button"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
