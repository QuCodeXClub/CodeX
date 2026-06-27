import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { FAQ } from "../models/faq.model.js";

// @desc    Get all FAQs (active ones for public, all for admin)
// @route   GET /api/v1/faqs
// @access  Public
const getFAQs = asyncHandler(async (req, res) => {
  // If we want admin to see all, we'd need to check auth, but let's keep it simple: 
  // Public might just query ?active=true, or we return all and frontend filters.
  // Actually let's return all. 
  const query = req.query.active === 'true' ? { isActive: true } : {};
  const faqs = await FAQ.find(query).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, faqs, "FAQs fetched successfully")
  );
});

// @desc    Create an FAQ
// @route   POST /api/v1/faqs
// @access  Private/Admin
const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, isActive } = req.body;

  if (!question || !answer) {
    throw new ApiError(400, "Question and answer are required");
  }

  const faq = await FAQ.create({
    question,
    answer,
    isActive: isActive !== undefined ? isActive : true,
  });

  return res.status(201).json(
    new ApiResponse(201, faq, "FAQ created successfully")
  );
});

// @desc    Update an FAQ
// @route   PATCH /api/v1/faqs/:id
// @access  Private/Admin
const updateFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { question, answer, isActive } = req.body;

  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  if (question) faq.question = question;
  if (answer) faq.answer = answer;
  if (isActive !== undefined) faq.isActive = isActive;

  await faq.save();

  return res.status(200).json(
    new ApiResponse(200, faq, "FAQ updated successfully")
  );
});

// @desc    Delete an FAQ
// @route   DELETE /api/v1/faqs/:id
// @access  Private/Admin
const deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const faq = await FAQ.findByIdAndDelete(id);

  if (!faq) {
    throw new ApiError(404, "FAQ not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "FAQ deleted successfully")
  );
});

export {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
