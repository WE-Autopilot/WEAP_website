/**
 * Error handling initialization
 * Can be imported and called in any component to setup error handling
 */
import { ensureToastContainer } from "./errorUtils";

/**
 * Initialize error handling for the application
 * This can be called from any component without modifying existing code
 */
export const initErrorHandling = (): void => {
  // Ensure toast container exists
  ensureToastContainer();

  // Set up global error handlers
  if (!window._errorHandlersInitialized) {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      console.error("[Unhandled Rejection]", event.reason);

      // If react-toastify is available, show error
      if (typeof import.meta.env !== "undefined" && import.meta.env.DEV) {
        import("./errorUtils").then(({ showErrorToast, logError }) => {
          const error =
            event.reason instanceof Error
              ? event.reason
              : new Error(String(event.reason));

          logError(error, "unhandled_promise_rejection");
          showErrorToast("An unexpected error occurred");
        });
      }
    });

    // Handle global errors
    window.addEventListener("error", (event) => {
      console.error("[Global Error]", event.error || event.message);

      // If react-toastify is available, show error in development
      if (typeof import.meta.env !== "undefined" && import.meta.env.DEV) {
        import("./errorUtils").then(({ showErrorToast, logError }) => {
          const error = event.error || new Error(event.message);
          logError(error, "global_error");
          showErrorToast("An unexpected error occurred");
        });
      }
    });

    // Fix ReactQueryDevtools in main.tsx
    if (
      typeof document !== "undefined" &&
      document.getElementById("root") &&
      !document.getElementById("react-query-devtools")
    ) {
      // Create dev tools container if in development
      if (typeof import.meta.env !== "undefined" && import.meta.env.DEV) {
        try {
          // Add dev tools in development mode
          import("@tanstack/react-query")
            .then(() => {
              import("@tanstack/react-query-devtools")
                .then(() => {
                  // Check if React is loaded
                  if (document.querySelector("[data-reactroot]")) {
                    // React is available in the page
                    const container = document.createElement("div");
                    container.id = "react-query-devtools";
                    document.body.appendChild(container);

                    // This is a workaround - in production you would properly integrate this
                    console.log(
                      'React Query DevTools available - import { ReactQueryDevtools } from "@tanstack/react-query-devtools" and add to your app'
                    );
                  }
                })
                .catch((err) => {
                  console.error("Error loading ReactQueryDevtools:", err);
                });
            })
            .catch((err) => {
              console.error("Error loading react-query:", err);
            });
        } catch (err) {
          console.error("Error setting up dev tools:", err);
        }
      }
    }

    // Mark as initialized
    window._errorHandlersInitialized = true;
  }
};

// Add to window for TypeScript
declare global {
  interface Window {
    _errorHandlersInitialized?: boolean;
  }
}
