import axios from "axios";

// Define the base URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Contact interface
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  fileName?: string | null;
  fileType?: string | null;
  fileData?: string | null;
}

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Contact API service
 * Provides methods to interact with the contact API endpoints
 */
const contactService = {
  /**
   * Submit a contact form
   * @param formData Contact form data
   * @returns Promise with the API response
   */
  submitContact: async (
    formData: ContactFormData
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.post(`${API_URL}/contacts`, formData);
      return response.data;
    } catch (error: any) {
      // Handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return error.response.data;
      }

      // The request was made but no response was received or something else went wrong
      return {
        success: false,
        data: null,
        message: error.message || "Failed to submit contact form",
      };
    }
  },

  /**
   * Get all contacts (admin only)
   * @param token JWT token
   * @param page Page number
   * @param limit Items per page
   * @param status Filter by status
   * @returns Promise with paginated contacts
   */
  getContacts: async (
    token: string,
    page = 1,
    limit = 10,
    status?: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.get(
        `${API_URL}/contacts?page=${page}&limit=${limit}${
          status ? `&status=${status}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch contacts",
      };
    }
  },

  /**
   * Get a single contact by ID (admin only)
   * @param token JWT token
   * @param id Contact ID
   * @returns Promise with contact data
   */
  getContact: async (token: string, id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.get(`${API_URL}/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        data: null,
        message: error.message || "Failed to fetch contact",
      };
    }
  },

  /**
   * Update contact status (admin only)
   * @param token JWT token
   * @param id Contact ID
   * @param status New status
   * @returns Promise with updated contact
   */
  updateContactStatus: async (
    token: string,
    id: string,
    status: "new" | "read" | "responded" | "archived"
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.patch(
        `${API_URL}/contacts/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        data: null,
        message: error.message || "Failed to update contact status",
      };
    }
  },

  /**
   * Delete a contact (admin only)
   * @param token JWT token
   * @param id Contact ID
   * @returns Promise with deletion result
   */
  deleteContact: async (
    token: string,
    id: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.delete(`${API_URL}/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        data: null,
        message: error.message || "Failed to delete contact",
      };
    }
  },
};

export default contactService;
