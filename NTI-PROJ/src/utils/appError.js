// كلاس بسيط للأخطاء المتوقعة عشان نبعت status code مظبوط للفرونت
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
