const User = require('../models/user.model');
const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// AUTHENTICATION: هل المستخدم مسجّل دخول أصلاً؟
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please sign in first.', 401));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please sign in again.', 401));
  }

  // نتأكد إن اليوزر لسه موجود في الداتابيز
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  req.user = currentUser;
  next();
});

// AUTHORIZATION: هل الدور بتاعه مسموح له؟
// استخدام: restrictTo('admin')  أو  restrictTo('admin', 'member')
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
