import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const tempUploadDir = path.resolve("public/temp");

const safeUnlinkTempFile = (filePath) => {
  if (!filePath || filePath.startsWith('data:')) return;

  const absolutePath = path.resolve(filePath);
  const relativePath = path.relative(tempUploadDir, absolutePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return;
  }

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath, folderName = "CodeX Website") => {
  try {
    if (!localFilePath) return null;
    
    const isDataUri = localFilePath.startsWith('data:');
    const isSvgDataUri = localFilePath.startsWith('data:image/svg+xml');
    
    const uploadOptions = {
      resource_type: isSvgDataUri ? "image" : "auto",
      folder: folderName,
      secure: true,
    };
    
    if (isSvgDataUri) {
      uploadOptions.format = "svg";
    }

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

    if (response) {
      const secureUrl = response.secure_url || (response.url ? response.url.replace(/^http:/i, 'https:') : '');
      response.url = secureUrl;
      response.secure_url = secureUrl;
    }

    // file has been uploaded successfully
    safeUnlinkTempFile(localFilePath);
    return response;
  } catch (error) {
    safeUnlinkTempFile(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;
    
    // Delete file from cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

const updateOnCloudinary = async (localFilePath, oldPublicId) => {
  try {
    if (!localFilePath || !oldPublicId) return null;

    // Upload the file on cloudinary, overwriting the old one and invalidating the cache
    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: oldPublicId,
      overwrite: true,
      invalidate: true,
      resource_type: "auto",
      secure: true,
    });
    
    if (response) {
      const secureUrl = response.secure_url || (response.url ? response.url.replace(/^http:/i, 'https:') : '');
      response.url = secureUrl;
      response.secure_url = secureUrl;
    }

    // File uploaded successfully, remove local file
    safeUnlinkTempFile(localFilePath);
    return response;
  } catch (error) {
    safeUnlinkTempFile(localFilePath);
    console.error("Error updating on Cloudinary:", error);
    return null;
  }
};

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
  return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
};

export { uploadOnCloudinary, deleteFromCloudinary, updateOnCloudinary, getPublicIdFromUrl };
