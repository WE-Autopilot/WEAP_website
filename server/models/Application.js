/**
 * Application Model
 * Matches the client-side Zod schema for data consistency
 */
const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      trim: true,
      lowercase: true,
      index: true,
    },
    schoolEmail: {
      type: String,
      required: [true, "School email is required"],
      match: [/@(?:[\w-]+\.)*uwo\.ca$/, "Must be a UWO email address"],
      trim: true,
      lowercase: true,
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      match: [/^[0-9]{8,10}$/, "Student ID must be 8-10 digits"],
      index: true,
    },
    program: {
      type: String,
      required: [true, "Program is required"],
      trim: true,
    },
    team: {
      type: String,
      required: [true, "Team selection is required"],
      trim: true,
    },
    resumeUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || v.startsWith("http");
        },
        message: "URL must start with http:// or https://",
      },
    },
    resumeMethod: {
      type: String,
      enum: ["url", "file"],
      default: "url",
    },
    resumeData: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for common query patterns
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ team: 1 });

module.exports = mongoose.model("Application", ApplicationSchema);
