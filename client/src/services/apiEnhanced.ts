/**
 * Enhanced API service that works alongside the existing API service
 * Adds better error handling and reporting
 */
import { handleApiError, showErrorToast, logError } from "../utils/errorUtils";
import { ApplicationFormData, SubmissionResponse } from "../types";

// API base URL (can be overridden by environment variable)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Enhanced application form submission API with better error handling
 */
export const enhancedApplicationService = {
  /**
   * Submit application form data to the API with improved error handling
   * @param applicationData Application data to submit
   * @returns Promise with submission response
   */
  submitApplication: async (
    applicationData: ApplicationFormData & {
      resumeMethod: string;
      resumeData: string;
      timestamp: string;
    }
  ): Promise<SubmissionResponse> => {
    try {
      // If backend is available, submit to real API
      if (process.env.NODE_ENV !== "development" || true) {
        // Force real API usage when available
        const response = await fetch(`${API_URL}/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Enhanced error handling
          const error = handleApiError(data);
          logError(error, "application_submission");
          showErrorToast(error);

          return {
            success: false,
            message: error.message || "Error submitting application",
            errors: error.errors,
          };
        }

        return { success: true, data: data.data };
      }

      // Fallback to simulation if API not available
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the data that would be sent
      console.log("Application data (simulation):", applicationData);

      // Return success response
      return { success: true };
    } catch (error: unknown) {
      // Enhanced error handling for unexpected errors
      const enhancedError = handleApiError(error);
      logError(enhancedError, "application_submission_exception");
      showErrorToast(enhancedError);

      return {
        success: false,
        message: enhancedError.message || "Error submitting application",
        errors: enhancedError.errors,
      };
    }
  },
};

/**
 * Generic enhanced fetch function with error handling
 * Can be used for any API call
 */
export const fetchWithErrorHandling = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const fullUrl = url.startsWith("http")
      ? url
      : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;

    const response = await fetch(fullUrl, options);
    const data = await response.json();

    if (!response.ok) {
      const error = handleApiError(data);
      logError(error, `api_call_${url}`);
      showErrorToast(error);
      throw error;
    }

    return data;
  } catch (error) {
    const enhancedError = handleApiError(error);
    logError(enhancedError, `api_call_exception_${url}`);
    showErrorToast(enhancedError);
    throw enhancedError;
  }
};

/**
 * Full enhanced API client that can be used instead of fetch
 */
export const enhancedApi = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchWithErrorHandling<T>(endpoint, {
      ...options,
      method: "GET",
    }),

  post: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
    fetchWithErrorHandling<T>(endpoint, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
    fetchWithErrorHandling<T>(endpoint, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchWithErrorHandling<T>(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
