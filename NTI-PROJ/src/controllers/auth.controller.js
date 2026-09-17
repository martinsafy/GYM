const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { signToken } = require('../utils/jwt');

const buildImageUrl = (req) => (req.file ? `/uploads/${req.file.filename}` : '');

// POST /api/v1/auth/signup
exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('This email is already registered.', 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password, // الهاش بيحصل تلقائي في الموديل
    phone,
    imageUrl: buildImageUrl(req),
    role: 'member', // حد يسجّل من الموقع بيبقى عضو دايماً
  });

  const token = signToken(user);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    },
  });
});

// POST /api/v1/auth/signin
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // لازم select('+password') لأنه مخفي في الموديل
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const token = signToken(user);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    },
  });
});

// GET /api/v1/auth/me
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});
