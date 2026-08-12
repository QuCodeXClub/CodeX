import crypto from 'crypto';
import { SpecialUtr } from '../models/specialUtr.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Generate Special UTR Code(s) (Admin Only)
 */
const generateSpecialUtr = asyncHandler(async (req, res) => {
  const { customCode, count = 1, notes = '' } = req.body;

  const generatedList = [];

  if (customCode && customCode.trim() !== '') {
    const formattedCode = customCode.trim().toUpperCase();

    const existing = await SpecialUtr.findOne({ code: formattedCode });
    if (existing) {
      throw new ApiError(400, `Special UTR code "${formattedCode}" already exists`);
    }

    const newUtr = await SpecialUtr.create({
      code: formattedCode,
      notes: notes.trim(),
      createdBy: req.admin?._id,
    });

    generatedList.push(newUtr);
  } else {
    const numToGenerate = Math.min(Math.max(parseInt(count, 10) || 1, 1), 50);

    for (let i = 0; i < numToGenerate; i++) {
      let uniqueCode = '';
      let isUnique = false;

      // Keep generating until a unique code is found
      while (!isUnique) {
        const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
        uniqueCode = `SP-${randomHex}`;
        const existing = await SpecialUtr.findOne({ code: uniqueCode });
        if (!existing) {
          isUnique = true;
        }
      }

      const newUtr = await SpecialUtr.create({
        code: uniqueCode,
        notes: notes.trim(),
        createdBy: req.admin?._id,
      });

      generatedList.push(newUtr);
    }
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { generated: generatedList, totalGenerated: generatedList.length },
      `Successfully generated ${generatedList.length} Special UTR code(s)`
    )
  );
});

/**
 * Get All Special UTR Codes (Admin Only)
 */
const getAllSpecialUtrs = asyncHandler(async (req, res) => {
  const { status = 'ALL', search = '', page = 1, limit = 50 } = req.query;

  const query = {};

  if (status === 'UNUSED') {
    query.isUsed = false;
  } else if (status === 'USED') {
    query.isUsed = true;
  }

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [{ code: searchRegex }, { notes: searchRegex }];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const parsedLimit = parseInt(limit, 10);

  const [utrs, total, unusedCount, usedCount] = await Promise.all([
    SpecialUtr.find(query)
      .populate('usedBy', 'name studentId course email phone status createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    SpecialUtr.countDocuments(query),
    SpecialUtr.countDocuments({ isUsed: false }),
    SpecialUtr.countDocuments({ isUsed: true }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        utrs,
        total,
        unusedCount,
        usedCount,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / parsedLimit),
      },
      'Special UTRs retrieved successfully'
    )
  );
});

/**
 * Delete Unused Special UTR Code (Admin Only)
 */
const deleteSpecialUtr = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const utr = await SpecialUtr.findById(id);

  if (!utr) {
    throw new ApiError(404, 'Special UTR code not found');
  }

  if (utr.isUsed) {
    throw new ApiError(400, 'Cannot delete a Special UTR code that has already been used by a student');
  }

  await SpecialUtr.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Special UTR code deleted successfully'));
});

export { generateSpecialUtr, getAllSpecialUtrs, deleteSpecialUtr };
