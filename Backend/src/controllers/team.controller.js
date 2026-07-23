import { TeamMember } from '../models/teamMember.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary, deleteFromCloudinary, updateOnCloudinary, getPublicIdFromUrl } from '../utils/cloudinary.js';

const addTeamMember = asyncHandler(async (req, res) => {
  const { academicYear, subTeam, name, post, sequenceNumber, email } = req.body;

  if (!academicYear || !subTeam || !name || !post) {
    throw new ApiError(400, 'All fields (academicYear, subTeam, name, post) are required');
  }

  const photoLocalPath = req.file?.path;

  if (!photoLocalPath) {
    throw new ApiError(400, 'Photo is required');
  }

  const photo = await uploadOnCloudinary(photoLocalPath, 'CodeX/team');

  if (!photo) {
    throw new ApiError(500, 'Error while uploading photo');
  }

  const member = await TeamMember.create({
    academicYear,
    subTeam,
    name,
    post,
    email,
    sequenceNumber: sequenceNumber ? Number(sequenceNumber) : 0,
    photo: photo.url,
  });
  return res.status(201).json(new ApiResponse(201, member, 'Team member added successfully'));
});
const getTeamMembers = asyncHandler(async (req, res) => {
  const { academicYear } = req.query;

  const query = {};
  if (academicYear) query.academicYear = academicYear;

  const members = await TeamMember.find(query).select('-email').sort({ subTeam: 1, sequenceNumber: 1 });

  return res.status(200).json(new ApiResponse(200, members, 'Team members fetched successfully'));
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await TeamMember.findById(id);

  if (!member) {
    throw new ApiError(404, 'Team member not found');
  }

  const publicId = getPublicIdFromUrl(member.photo);

  await deleteFromCloudinary(publicId);
  await member.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, 'Team member deleted successfully'));
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { academicYear, subTeam, name, post, sequenceNumber, email } = req.body;
  const member = await TeamMember.findById(id);

  if (!member) {
    throw new ApiError(404, 'Team member not found');
  }

  let newPhotoUrl = member.photo;

  if (req.file) {
    const oldPublicId = getPublicIdFromUrl(member.photo);

    const uploadedImage = await updateOnCloudinary(req.file.path, oldPublicId);
    if (!uploadedImage) {
      throw new ApiError(500, 'Error while updating photo');
    }
    newPhotoUrl = uploadedImage.url;
  }

  member.academicYear = academicYear || member.academicYear;
  member.subTeam = subTeam || member.subTeam;
  member.name = name || member.name;
  member.post = post || member.post;
  member.email = email !== undefined ? email : member.email;
  member.sequenceNumber = sequenceNumber !== undefined ? Number(sequenceNumber) : member.sequenceNumber;
  member.photo = newPhotoUrl;
  await member.save();
  return res.status(200).json(new ApiResponse(200, member, 'Team member updated successfully'));
});

export { addTeamMember, getTeamMembers, deleteTeamMember, updateTeamMember };
