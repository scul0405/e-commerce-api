class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = statusCode.startsWith('4') ? 'failed' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
