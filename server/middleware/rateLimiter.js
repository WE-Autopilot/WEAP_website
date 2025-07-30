/**
 * Rate limiting middleware
 * Prevents abuse of API endpoints
 */
const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");
require("dotenv").config();

// MongoDB URI from environment
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/weap_db";

/**
 * Standard API rate limiter
 * Limits requests based on IP address
 */
exports.apiLimiter = rateLimit({
  store: new MongoStore({
    uri: MONGODB_URI,
    collectionName: "rate-limits",
    expireTimeMs: 15 * 60 * 1000, // 15 minutes
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

/**
 * Stricter limiter for auth routes
 * Prevents brute force attacks
 */
exports.authLimiter = rateLimit({
  store: new MongoStore({
    uri: MONGODB_URI,
    collectionName: "auth-limits",
    expireTimeMs: 60 * 60 * 1000, // 1 hour
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});
