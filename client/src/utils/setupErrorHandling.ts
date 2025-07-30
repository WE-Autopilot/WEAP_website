/**
 * Error handling setup
 * This file automatically initializes error handling when imported
 * Usage: Just import this file anywhere in your app, like in main.tsx or App.tsx:
 * import './utils/setupErrorHandling';
 */
import { initErrorHandling } from "./errorInit";

// Initialize error handling immediately when this file is imported
if (typeof window !== "undefined") {
  // Execute after DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initErrorHandling);
  } else {
    // DOM already loaded, initialize immediately
    initErrorHandling();
  }
}

// Export nothing - this module works through side effects
export {};
