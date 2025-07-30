/**
 * Error handling utilities
 * Provides consistent error handling throughout the application
 * Can be imported and used without changing existing code
 */
import { toast } from "react-toastify";
import { trackEvent } from "./analytics";
import React from "react";

// Error types that match server-side errors
export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND_ERROR",
  CONFLICT = "CONFLICT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// Standard error structure
export interface AppError {
  type?: ErrorType;
  message: string;
  details?: any;
  errors?: string[];
  timestamp?: string;
  stack?: string;
}

// API error response structure
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: string[];
  stack?: string;
}

/**
 * Log error to console and analytics
 * Can be called from anywhere in the app without changing existing code
 */
export const logError = (
  error: Error | AppError,
  componentInfo?: string
): void => {
  console.error("[Error]", error);

  // Track error in analytics
  trackEvent(
    "Error",
    componentInfo || "unspecified_component",
    `${error.message || error.toString()} | ${
      (error as any).stack?.slice(0, 150) || "No stack trace"
    }`
  );
};

/**
 * Handle API error response
 * Converts any API error to a standardized format
 */
export const handleApiError = (error: any): AppError => {
  // Network error (no response)
  if (!error.response && !error.success) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: "Network error. Please check your connection and try again.",
    };
  }

  // API error with standard structure
  if (error.success === false) {
    return {
      message: error.message || "An error occurred",
      errors: error.errors,
      stack: error.stack,
    };
  }

  // Generic error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error.message || "An unexpected error occurred",
  };
};

/**
 * Display user-friendly error toast notification
 * Can be called from anywhere in the app
 */
export const showErrorToast = (error: Error | AppError | string): void => {
  let message = "";

  if (typeof error === "string") {
    message = error;
  } else if ("message" in error) {
    message = error.message;
  } else {
    message = error.toString();
  }

  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Enhanced fetch API with error handling
 * Can be used alongside existing fetch calls
 */
export const fetchWithErrorHandling = async (
  url: string,
  options?: RequestInit
): Promise<any> => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const error = handleApiError(data);
      showErrorToast(error);
      throw error;
    }

    return data;
  } catch (error) {
    logError(error as Error, "fetch_api");
    throw error;
  }
};

/**
 * Error fallback component for use with react-error-boundary
 * Can be used without changing existing code
 */
export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}): React.ReactElement => {
  // Log error when fallback is shown
  logError(error, "error_boundary_fallback");

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

/**
 * Add toast container to the app
 * Can be called from any component to ensure toast container exists
 */
export const ensureToastContainer = (): void => {
  // Check if toast container already exists
  if (!document.getElementById("react-toast-container")) {
    // Import dynamically to avoid affecting existing code
    import("react-toastify/dist/ReactToastify.css").then(() => {
      // Create container element
      const toastContainer = document.createElement("div");
      toastContainer.id = "react-toast-container";
      document.body.appendChild(toastContainer);

      // Render toast container
      const renderToastContainer = () => {
        const { ToastContainer } = require("react-toastify");
        const { createRoot } = require("react-dom/client");
        const React = require("react");

        const root = createRoot(toastContainer);
        root.render(
          React.createElement(ToastContainer, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            newestOnTop: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
          })
        );
      };

      // Execute after a small delay to ensure imports are ready
      setTimeout(renderToastContainer, 0);
    });
  }
};
