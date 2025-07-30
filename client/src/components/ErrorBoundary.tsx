import React, { Component, ErrorInfo, ReactNode } from "react";
import { trackEvent } from "../utils/analytics";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the analytics system
    trackEvent(
      "Error",
      "error_boundary",
      `${error.toString()} | ${
        errorInfo.componentStack?.slice(0, 150) || "No stack trace"
      }`
    );

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = (): void => {
    trackEvent("Error", "reload_after_error", "User reloaded after error");
    window.location.reload();
  };

  handleGoHome = (): void => {
    trackEvent("Error", "go_home_after_error", "User went home after error");
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but there was an issue loading this page.</p>

            <div className="error-actions">
              <button onClick={this.handleReload} className="reload-button">
                Try Again
              </button>
              <button onClick={this.handleGoHome} className="home-button">
                Go to Homepage
              </button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
