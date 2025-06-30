/**
 * MongoDB database connection configuration
 */
const mongoose = require("mongoose");
require("dotenv").config();

// Get MongoDB URI from environment variables with fallback
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/weap_db";

// Connection options with best practices
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
