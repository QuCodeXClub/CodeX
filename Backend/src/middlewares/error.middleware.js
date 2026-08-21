import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Handle Mongoose Validation Error (user friendly message)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join('. ');
    error = new ApiError(400, message || "Validation failed. Please verify all fields.");
  } 
  // 2. Handle MongoDB Duplicate Key Error (11000)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const fieldLabel = field === 'studentId' ? 'Student ID (Q-ID)' : field === 'transactionId' ? 'Transaction UTR' : field === 'email' ? 'Email Address' : 'information';
    const message = `A record with this ${fieldLabel} already exists in the system.`;
    error = new ApiError(409, message);
  }
  // 3. Handle Mongoose CastError (Invalid ID format)
  else if (err.name === 'CastError') {
    const message = "Requested resource not found or invalid format.";
    error = new ApiError(400, message);
  }
  // 4. Handle JWT Authentication Errors
  else if (err.name === 'JsonWebTokenError') {
    const message = "Invalid authentication session. Please sign in again.";
    error = new ApiError(401, message);
  }
  else if (err.name === 'TokenExpiredError') {
    const message = "Your session has expired. Please sign in again.";
    error = new ApiError(401, message);
  }
  // 5. Handle Multer Upload Errors
  else if (err.name === 'MulterError') {
    let message = "An error occurred during file upload.";
    if (err.code === 'LIMIT_FILE_SIZE') message = "File is too large. Please upload a smaller file.";
    error = new ApiError(400, message);
  }
  // 6. Generic Exception Fallback
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = "An unexpected error occurred. Please try again.";
    error = new ApiError(statusCode, message);
  }

  // Final Sanitization: Ensure no internal Mongo, Mongoose, or code traces leak
  let finalMessage = error.message;
  if (!error.statusCode || error.statusCode === 500 || /mongo|mongoose|casterror|syntaxerror|e11000|referenceerror|typeerror/i.test(finalMessage)) {
    finalMessage = "An unexpected server error occurred. Please try again.";
  }

  const response = {
    success: false,
    message: finalMessage,
    errors: error.errors || [],
  };

  return res.status(error.statusCode || 500).json(response);
};

export { errorHandler };
