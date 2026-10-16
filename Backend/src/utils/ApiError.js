class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    data = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (data && typeof data === "object") {
      if (data.attemptsRemaining !== undefined) this.attemptsRemaining = data.attemptsRemaining;
      if (data.maxAttempts !== undefined) this.maxAttempts = data.maxAttempts;
      if (data.isLocked !== undefined) this.isLocked = data.isLocked;
      if (data.retryAfter !== undefined) this.retryAfter = data.retryAfter;
      if (data.rateLimit !== undefined) this.rateLimit = data.rateLimit;
    }

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
