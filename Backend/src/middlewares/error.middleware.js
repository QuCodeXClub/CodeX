import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ApiError(400, message);
  } 
  // 2. Handle MongoDB Duplicate Key Error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `A record with this ${field || 'information'} already exists.`;
    error = new ApiError(409, message);
  }
  // 3. Handle Mongoose CastError (Invalid ID format)
  else if (err.name === 'CastError') {
    const message = `Resource not found or invalid format for ${err.path}.`;
    error = new ApiError(400, message);
  }
  // 4. Handle JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    const message = "Invalid session token. Please log in again.";
    error = new ApiError(401, message);
  }
  else if (err.name === 'TokenExpiredError') {
    const message = "Your session has expired. Please log in again.";
    error = new ApiError(401, message);
  }
  // 5. Handle Multer Errors
  else if (err.name === 'MulterError') {
    let message = "File upload error occurred.";
    if (err.code === 'LIMIT_FILE_SIZE') message = "File is too large. Please upload a smaller file.";
    error = new ApiError(400, message);
  }
  // 6. Generic Fallback
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    
    // Mask the message in production for true 500 errors
    let message = error.message || "Internal Server Error";
    if (process.env.NODE_ENV === "production" && statusCode === 500) {
      message = "An unexpected server error occurred. Our team has been notified.";
    }

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Sanitize message in production for 500 server errors
  let finalMessage = error.message;
  if (process.env.NODE_ENV === "production" && (error.statusCode === 500 || !error.statusCode)) {
    finalMessage = "An unexpected server error occurred. Our team has been notified.";
  }

  // Construct standard professional response explicitly to avoid leaking raw object properties
  const response = {
    success: false,
    message: finalMessage,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Stack trace only in development
  };

  return res.status(error.statusCode || 500).json(response);
};

export { errorHandler };
