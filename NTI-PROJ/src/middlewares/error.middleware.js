const multer = require('multer');
const AppError = require('../utils/appError');

// الراوت اللي مش موجود
exports.notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
};

// الـ global error handler
exports.globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // أخطاء الفاليديشن من mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join('. '), 400);
  }

  // إيميل مكرر
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new AppError(`This ${field} is already taken. Please use another one.`, 400);
  }

  // id شكله غلط
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // أخطاء multer
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('Image is too large. Maximum size is 5MB.', 400);
    } else {
      error = new AppError(`Upload error: ${err.message}`, 400);
    }
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong on the server';

  if (statusCode === 500) {
    console.error('UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
  });
};
