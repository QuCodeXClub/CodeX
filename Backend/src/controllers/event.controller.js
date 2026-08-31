import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
  updateOnCloudinary,
  getPublicIdFromUrl,
} from "../utils/cloudinary.js";

const parseDateSafe = (val, fieldName, isRequired = false) => {
  if (!val) {
    if (isRequired) throw new ApiError(400, `${fieldName} is required`);
    return null;
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) {
    throw new ApiError(400, `Invalid date format for ${fieldName}`);
  }
  return d;
};

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .flatMap((t) => {
        if (typeof t === "string") {
          const trimmed = t.trim();
          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
              const parsed = JSON.parse(trimmed);
              if (Array.isArray(parsed))
                return parsed.map((item) => String(item).trim());
            } catch {
              // fallback to comma split
            }
          }
          return trimmed.split(",");
        }
        return String(t);
      })
      .map((t) => (typeof t === "string" ? t.trim() : String(t).trim()))
      .filter(Boolean);
  }
  if (typeof tags === "string") {
    const trimmed = tags.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => String(t).trim()).filter(Boolean);
        }
      } catch {
        // Fallback to comma split if JSON parse fails
      }
    }
    return trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeLocationType = (type) => {
  if (!type) return "Offline";
  const normalized = String(type).trim();
  if (normalized.toLowerCase() === "online") return "Online";
  if (normalized.toLowerCase() === "offline") return "Offline";
  throw new ApiError(400, "Location type must be either 'Online' or 'Offline'");
};

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createEvent = asyncHandler(async (req, res) => {
  const {
    eventName,
    date,
    registrationCloseDate,
    description,
    registrationLink,
    locationType,
    location,
    tags,
  } = req.body;

  if (!eventName || !date || !description) {
    throw new ApiError(400, "Event name, date, and description are required");
  }

  const parsedDate = parseDateSafe(date, "Event date", true);
  const parsedRegistrationCloseDate = parseDateSafe(
    registrationCloseDate,
    "Registration close date",
    false
  );

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "CodeX/event"
  );

  if (!coverImage) {
    throw new ApiError(500, "Error while uploading cover image");
  }

  const event = await Event.create({
    eventName: String(eventName).trim(),
    date: parsedDate,
    registrationCloseDate: parsedRegistrationCloseDate,
    description,
    registrationLink: registrationLink ? String(registrationLink).trim() : "",
    locationType: locationType
      ? normalizeLocationType(locationType)
      : "Offline",
    location: location !== undefined ? String(location).trim() : "",
    tags: parseTags(tags),
    coverImage: coverImage.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully"));
});

const getEvents = asyncHandler(async (req, res) => {
  const { type, search, all } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
  const isUnpaged = all === "true" || req.query.limit === "0";

  const filter = {};
  let sort = { date: -1 };

  const now = new Date();
  if (type === "upcoming") {
    filter.date = { $gte: now };
  } else if (type === "past") {
    filter.date = { $lt: now };
    sort = { date: -1, createdAt: -1 };
  }

  if (search && typeof search === "string" && search.trim()) {
    const safeSearch = escapeRegex(search.trim()).slice(0, 100);
    const searchRegex = new RegExp(safeSearch, "i");
    filter.$or = [
      { eventName: searchRegex },
      { location: searchRegex },
      { tags: { $in: [searchRegex] } },
    ];
  }

  const buildSmartPipeline = (matchFilter) => [
    ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
    {
      $addFields: {
        isRegOpen: {
          $and: [
            { $gte: ["$date", now] },
            {
              $gt: [
                { $strLenCP: { $ifNull: ["$registrationLink", ""] } },
                0,
              ],
            },
            {
              $or: [
                { $eq: ["$registrationCloseDate", null] },
                { $not: ["$registrationCloseDate"] },
                { $gte: ["$registrationCloseDate", now] },
              ],
            },
          ],
        },
        isUpcoming: { $gte: ["$date", now] },
      },
    },
    {
      $addFields: {
        sortKey: {
          $cond: [
            "$isRegOpen",
            // Tier 1: Reg Open -> Soonest upcoming first (0 to ~1e14)
            { $subtract: ["$date", now] },
            {
              $cond: [
                "$isUpcoming",
                // Tier 2: Upcoming but Reg Closed -> Soonest upcoming first (~1e14 to ~2e14)
                { $add: [100000000000000, { $subtract: ["$date", now] }] },
                // Tier 3: Past -> Most recent past first (~2e14+)
                { $add: [200000000000000, { $subtract: [now, "$date"] }] },
              ],
            },
          ],
        },
      },
    },
    { $sort: { sortKey: 1, createdAt: -1 } },
    { $project: { isRegOpen: 0, isUpcoming: 0, sortKey: 0 } },
  ];

  if (isUnpaged) {
    if (type === "past") {
      const events = await Event.find(filter).sort(sort).lean();
      return res
        .status(200)
        .json(new ApiResponse(200, { events, pagination: null }, "Events fetched successfully"));
    }

    const events = await Event.aggregate(buildSmartPipeline(filter));
    return res
      .status(200)
      .json(new ApiResponse(200, { events, pagination: null }, "Events fetched successfully"));
  }

  const skip = (page - 1) * limit;

  let events;
  let total;

  if (type === "past") {
    [events, total] = await Promise.all([
      Event.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);
  } else {
    const pipeline = buildSmartPipeline(filter);
    [events, total] = await Promise.all([
      Event.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
      Event.countDocuments(filter),
    ]);
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Events fetched successfully"
    )
  );
});

const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid event ID format");
  }

  const event = await Event.findById(id).lean();

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event fetched successfully"));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid event ID format");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Extract public ID from Cloudinary URL and safely attempt removal
  if (event.coverImage) {
    try {
      const publicId = getPublicIdFromUrl(event.coverImage);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    } catch (err) {
      console.warn("Could not delete Cloudinary image for event:", err.message);
    }
  }

  await event.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Event deleted successfully"));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    eventName,
    date,
    registrationCloseDate,
    description,
    registrationLink,
    locationType,
    location,
    tags,
  } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid event ID format");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  let newCoverImageUrl = event.coverImage;

  if (req.file) {
    const oldPublicId = getPublicIdFromUrl(event.coverImage);

    const uploadedImage = await updateOnCloudinary(req.file.path, oldPublicId);
    if (!uploadedImage) {
      throw new ApiError(500, "Error while updating cover image");
    }
    newCoverImageUrl = uploadedImage.url;
  }

  if (eventName !== undefined) event.eventName = String(eventName).trim();
  if (date !== undefined) {
    event.date = parseDateSafe(date, "Event date", true);
  }
  if (registrationCloseDate !== undefined) {
    event.registrationCloseDate = parseDateSafe(
      registrationCloseDate,
      "Registration close date",
      false
    );
  }
  if (description !== undefined) event.description = description;
  if (registrationLink !== undefined) {
    event.registrationLink = registrationLink ? String(registrationLink).trim() : "";
  }
  if (locationType !== undefined) {
    event.locationType = normalizeLocationType(locationType);
  }
  if (location !== undefined) {
    event.location = String(location).trim();
  }
  if (tags !== undefined) {
    event.tags = parseTags(tags);
  }
  event.coverImage = newCoverImageUrl;

  await event.save();

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event updated successfully"));
});

export { createEvent, getEvents, getEventById, deleteEvent, updateEvent };

