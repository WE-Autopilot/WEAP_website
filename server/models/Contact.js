/**
 * Contact Model
 * Based on the client-side Yup schema for data consistency
 */
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      trim: true,
      lowercase: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
      index: true,
    },
    phone: {
      type: String,
      match: [
        /^(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
        "Please use a valid phone number",
      ],
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [2, "Subject must be at least 2 characters"],
      maxlength: [100, "Subject cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    // File handling fields
    fileName: {
      type: String,
    },
    fileType: {
      type: String,
    },
    filePath: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    // Metadata fields
    status: {
      type: String,
      enum: ["new", "read", "responded", "archived"],
      default: "new",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for common query patterns
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

// Add methods to the model
ContactSchema.methods.markAsRead = function () {
  this.status = "read";
  return this.save();
};

ContactSchema.methods.markAsResponded = function () {
  this.status = "responded";
  return this.save();
};

ContactSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Create and export the model
const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
