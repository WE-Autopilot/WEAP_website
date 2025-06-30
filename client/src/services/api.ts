/**
 * API service for application
 */
import { ApplicationFormData, SubmissionResponse } from "../types";

// API base URL (can be overridden by environment variable)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Application form submission API
 */
export const applicationService = {
  /**
   * Submit application form data to the API
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
          console.error("API error:", data);
          return {
            success: false,
            message: data.message || "Error submitting application",
            errors: data.errors,
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
      console.error("Error submitting application:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error submitting application",
      };
    }
  },
};

/**
 * For demo purposes only - in production, this would be server-side
 */
export const createDemoCSVDownload = (
  applicationData: ApplicationFormData & {
    resumeMethod: string;
    resumeData: string;
    timestamp: string;
  }
) => {
  // NOTE: In a production environment, this function would not exist.
  // The server would handle file generation and provide download links.
  const csvRow = [
    applicationData.name,
    applicationData.email,
    applicationData.schoolEmail,
    applicationData.studentId,
    applicationData.program,
    applicationData.team,
    applicationData.resumeMethod === "file"
      ? applicationData.resumeData
      : "URL: " + applicationData.resumeData,
    applicationData.timestamp,
  ]
    .map((field) => `"${field || ""}"`)
    .join(",");

  const csvHeader =
    "Name,Email,School Email,Student ID,Program,Team,Resume,Timestamp";
  const csvContent = `${csvHeader}\n${csvRow}`;

  // Create download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `application_${applicationData.name.replace(/\s+/g, "_")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
