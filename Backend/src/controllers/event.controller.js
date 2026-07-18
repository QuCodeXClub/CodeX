import { Event } from '../models/event.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary, deleteFromCloudinary, updateOnCloudinary, getPublicIdFromUrl } from '../utils/cloudinary.js';

const createEvent = asyncHandler(async (req, res) => {
  const { eventName, date, description, registrationLink } = req.body;

  if (!eventName || !date || !description) {
    throw new ApiError(400, 'Event name, date, and description are required');
  }

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, 'Cover image is required');
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath, 'CodeX/event');

  if (!coverImage) {
    throw new ApiError(500, 'Error while uploading cover image');
  }

  const event = await Event.create({
    eventName,
    date,
    description,
    registrationLink,
    coverImage: coverImage.url,
  });

  return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ date: -1 });

  return res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully'));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Extract public ID from Cloudinary URL
  const publicId = getPublicIdFromUrl(event.coverImage);

  await deleteFromCloudinary(publicId);
  await event.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, 'Event deleted successfully'));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { eventName, date, description, registrationLink } = req.body;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  let newCoverImageUrl = event.coverImage;

  if (req.file) {
    const oldPublicId = getPublicIdFromUrl(event.coverImage);

    const uploadedImage = await updateOnCloudinary(req.file.path, oldPublicId);
    if (!uploadedImage) {
      throw new ApiError(500, 'Error while updating cover image');
    }
    newCoverImageUrl = uploadedImage.url;
  }

  event.eventName = eventName || event.eventName;
  event.date = date || event.date;
  event.description = description || event.description;
  event.registrationLink = registrationLink !== undefined ? registrationLink : event.registrationLink;
  event.coverImage = newCoverImageUrl;

  await event.save();

  return res.status(200).json(new ApiResponse(200, event, 'Event updated successfully'));
});

export { createEvent, getEvents, deleteEvent, updateEvent };
