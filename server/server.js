/**
 * Main server file for the WEAP application
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const { connectDB } = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const { sanitizeBody } = require("./middleware/sanitize");
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet()); // Set security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.CLIENT_URL || "http://localhost:5173"],
    },
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitization middleware
app.use(mongoSanitize()); // Prevent MongoDB operator injection
app.use(xssClean()); // Prevent XSS attacks
app.use(sanitizeBody); // Custom sanitization for string inputs

// CORS middleware with specific configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "https://weap.yourwebsite.com",
  // Add other allowed origins here
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // Cache preflight request for 1 day
  })
);

// Apply rate limiting to API routes
app.use("/api", apiLimiter);

// Integrate enhanced features
const enhance = require("./enhance");
enhance(app);

// Apply security enhancements
const secureEnhance = require("./secure-enhance");
secureEnhance(app);

// API routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/applications", require("./routes/api/applications"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  // Close server & exit process on unhandled promise rejection
  server.close(() => process.exit(1));
});

module.exports = server; // Export for testing
