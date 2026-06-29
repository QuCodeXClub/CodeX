import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Contact } from "../models/contact.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { contactFormReceivedEmail } from "../utils/emailTemplates.js";
import { verifyTurnstileToken } from "../utils/turnstile.js";

// @desc    Submit a contact form
// @route   POST /api/v1/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message, turnstileToken } = req.body;

  // 1. Verify Bot Token
  if (!turnstileToken) {
    throw new ApiError(400, "Bot verification token is missing");
  }

  const isHuman = await verifyTurnstileToken(turnstileToken);
  if (!isHuman) {
    throw new ApiError(400, "Bot verification failed. Please try again.");
  }

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "All fields are required");
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  // Send confirmation email to the user (non-blocking)
  sendEmail({
    email,
    subject: "We received your message - CodeX",
    message: contactFormReceivedEmail(name),
  }).catch((err) => {
    console.error("Failed to send contact confirmation email:", err);
  });

  return res.status(201).json(
    new ApiResponse(201, contact, "Message sent successfully")
  );
});

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private/Admin
const getAllContactMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, messages, "Contact messages fetched successfully")
  );
});

// @desc    Mark message as read
// @route   PATCH /api/v1/contact/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Contact.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res.status(200).json(
    new ApiResponse(200, message, "Message marked as read")
  );
});

// @desc    Delete a message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Contact.findByIdAndDelete(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Message deleted successfully")
  );
});

export {
  submitContactForm,
  getAllContactMessages,
  markAsRead,
  deleteMessage,
};
