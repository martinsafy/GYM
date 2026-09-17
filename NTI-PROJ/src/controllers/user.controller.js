const User = require('../models/user.model');
const GymClass = require('../models/class.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/users/classes - الحصص بتاعة العضو الحالي
exports.getMyClasses = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('myClasses');

  res.status(200).json({
    status: 'success',
    results: user.myClasses.length,
    data: { myClasses: user.myClasses },
  });
});

// POST /api/v1/users/classes - الاشتراك في حصة
exports.enrollInClass = catchAsync(async (req, res, next) => {
  const { classId } = req.body;

  if (!classId) {
    return next(new AppError('classId is required', 400));
  }

  const gymClass = await GymClass.findById(classId);
  if (!gymClass) {
    return next(new AppError('No class found with that id', 404));
  }

  const user = await User.findById(req.user._id);

  // مش هنسمح بالاشتراك مرتين
  const alreadyEnrolled = user.myClasses.some((id) => id.toString() === classId);
  if (alreadyEnrolled) {
    return next(new AppError('You are already enrolled in this class', 400));
  }

  // نتأكد إن في أماكن فاضية
  if (gymClass.members >= gymClass.capacity) {
    return next(new AppError('This class is fully booked', 400));
  }

  user.myClasses.push(classId);
  await user.save({ validateBeforeSave: false });

  gymClass.members += 1;
  await gymClass.save();

  const updatedUser = await User.findById(req.user._id).populate('myClasses');

  res.status(200).json({
    status: 'success',
    data: { myClasses: updatedUser.myClasses },
  });
});

// DELETE /api/v1/users/classes/:classId - إلغاء الاشتراك
exports.cancelEnrollment = catchAsync(async (req, res, next) => {
  const { classId } = req.params;

  const user = await User.findById(req.user._id);

  const isEnrolled = user.myClasses.some((id) => id.toString() === classId);
  if (!isEnrolled) {
    return next(new AppError('You are not enrolled in this class', 400));
  }

  user.myClasses = user.myClasses.filter((id) => id.toString() !== classId);
  await user.save({ validateBeforeSave: false });

  const gymClass = await GymClass.findById(classId);
  if (gymClass && gymClass.members > 0) {
    gymClass.members -= 1;
    await gymClass.save();
  }

  const updatedUser = await User.findById(req.user._id).populate('myClasses');

  res.status(200).json({
    status: 'success',
    data: { myClasses: updatedUser.myClasses },
  });
});

// GET /api/v1/users  (admin only) - كل الأعضاء
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().populate('myClasses', 'title category');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// PATCH /api/v1/users/:id/role  (admin only) - تغيير دور المستخدم
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!['admin', 'member'].includes(role)) {
    return next(new AppError('Role must be either admin or member', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('No user found with that id', 404));
  }

  res.status(200).json({ status: 'success', data: { user } });
});

// DELETE /api/v1/users/:id  (admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that id', 404));
  }

  res.status(200).json({ status: 'success', data: { user } });
});
