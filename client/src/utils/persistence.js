/**
 * Form persistence utility for autosave and recovery of form data
 */

/**
 * Save form data to localStorage with expiration
 * @param {string} formId - Unique identifier for the form
 * @param {Object} data - Form data to save
 * @param {number} expirationHours - Hours until data expires (default: 24)
 */
export const saveFormData = (formId, data, expirationHours = 24) => {
  try {
    const storageItem = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + expirationHours * 60 * 60 * 1000,
    };

    localStorage.setItem(`form_${formId}`, JSON.stringify(storageItem));
  } catch (error) {
    console.error("Error saving form data:", error);
  }
};

/**
 * Retrieve saved form data if it exists and hasn't expired
 * @param {string} formId - Unique identifier for the form
 * @returns {Object|null} - The saved form data or null if none exists or expired
 */
export const getSavedFormData = (formId) => {
  try {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData);

    // Check if data has expired
    if (parsedData.expiresAt && parsedData.expiresAt < Date.now()) {
      localStorage.removeItem(`form_${formId}`);
      return null;
    }

    return parsedData.data;
  } catch (error) {
    console.error("Error retrieving saved form data:", error);
    return null;
  }
};

/**
 * Clear saved form data
 * @param {string} formId - Unique identifier for the form
 */
export const clearSavedFormData = (formId) => {
  try {
    localStorage.removeItem(`form_${formId}`);
  } catch (error) {
    console.error("Error clearing form data:", error);
  }
};

/**
 * Create a debounced function for autosave
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 1000) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Clean up expired form data in localStorage
 */
export const cleanupExpiredForms = () => {
  try {
    const now = Date.now();

    // Get all keys in localStorage that start with 'form_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("form_")) {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            if (parsedData.expiresAt && parsedData.expiresAt < now) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            // If data is corrupt, remove it
            localStorage.removeItem(key);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired forms:", error);
  }
};

// Run cleanup on module load
if (typeof window !== "undefined") {
  cleanupExpiredForms();
}
