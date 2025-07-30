/**
 * Comprehensive analytics utility that supports multiple tracking systems
 * and includes offline tracking capabilities
 */

// Extend Window interface to include analytics-related properties
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
    fbq?: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

interface AnalyticsEvent {
  category: string;
  action: string;
  label: string;
  value: number | null;
  timestamp: number;
  url: string;
  referrer: string;
}

/**
 * Track a user event with comprehensive metadata
 * @param category - Event category (e.g., 'Application', 'Navigation')
 * @param action - Action performed (e.g., 'submit', 'view')
 * @param label - Additional label/context
 * @param value - Optional numerical value
 */
export const trackEvent = (
  category: string,
  action: string,
  label: string,
  value: number | null = null
): void => {
  // Track event timestamp
  const timestamp = Date.now();

  // Google Analytics support
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Facebook Pixel support
  if (window.fbq) {
    window.fbq("trackCustom", action, {
      category,
      label,
      value,
    });
  }

  // Store in localStorage for offline recovery
  try {
    const events: AnalyticsEvent[] = JSON.parse(
      localStorage.getItem("analytics_queue") || "[]"
    );
    events.push({
      category,
      action,
      label,
      value,
      timestamp,
      url: window.location.href,
      referrer: document.referrer,
    });

    // Keep last 100 events to prevent localStorage from getting too large
    localStorage.setItem("analytics_queue", JSON.stringify(events.slice(-100)));

    // If we're back online and have queued events, process them
    if (navigator.onLine && events.length > 0) {
      processQueuedEvents();
    }
  } catch (e) {
    console.error("Analytics storage error:", e);
  }
};

/**
 * Process queued analytics events when back online
 */
const processQueuedEvents = (): void => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(
      localStorage.getItem("analytics_queue") || "[]"
    );
    if (events.length === 0) return;

    // In a real implementation, you would batch send these to your backend
    console.log(`Processing ${events.length} queued analytics events`);

    // Clear queue after processing
    localStorage.setItem("analytics_queue", "[]");
  } catch (e) {
    console.error("Error processing queued events:", e);
  }
};

/**
 * Track form interactions for detailed analytics
 * @param formName - Name of the form
 * @param fieldName - Field being interacted with
 * @param interactionType - Type of interaction (focus, blur, change)
 */
export const trackFormInteraction = (
  formName: string,
  fieldName: string,
  interactionType: string
): void => {
  trackEvent("Form Interaction", interactionType, `${formName} - ${fieldName}`);
};

/**
 * Track page view with enhanced metadata
 * @param pageName - Name of the page
 */
export const trackPageView = (pageName: string): void => {
  trackEvent(
    "Page View",
    "view",
    pageName,
    performance.now() // Track how long it took to load the page
  );
};

// Set up listeners for online/offline status
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    trackEvent("System", "network_status", "online");
    processQueuedEvents();
  });

  window.addEventListener("offline", () => {
    trackEvent("System", "network_status", "offline");
  });
}
