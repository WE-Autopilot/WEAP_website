/**
 * Input sanitization middleware
 * Prevents XSS and other injection attacks
 */
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

// Create DOMPurify instance with virtual DOM
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitizes all string fields in request body
 * Removes potential XSS and script content
 */
exports.sanitizeBody = (req, res, next) => {
  if (req.body) {
    // For each field in the request body
    Object.keys(req.body).forEach((key) => {
      // Only sanitize string values
      if (typeof req.body[key] === "string") {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    });
  }
  next();
};
