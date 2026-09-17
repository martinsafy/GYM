const GymClass = require('../models/class.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// READ ALL - GET /api/v1/classes
// بيدعم الفلترة والبحث: ?category=yoga&level=beginner&search=morning
exports.getAllClasses = catchAsync(async (req, res) => {
  const { category, level, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { trainer: { $regex: search, $options: 'i' } },
    ];
  }

  const classes = await GymClass.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: { classes },
  });
});

// READ ONE - GET /api/v1/classes/:id
exports.getClassById = catchAsync(async (req, res, next) => {
  const gymClass = await GymClass.findById(req.params.id).populate('trainerId');

  if (!gymClass) {
    return next(new AppError('No class found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { class: gymClass },
  });
});

// CREATE - POST /api/v1/classes  (admin only)
exports.createClass = catchAsync(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.imageUrl = `/uploads/${req.file.filename}`;
  }

  const gymClass = await GymClass.create(data);

  res.status(201).json({
    status: 'success',
    data: { class: gymClass },
  });
});

// UPDATE - PATCH /api/v1/classes/:id  (admin only)
exports.updateClass = catchAsync(async (req, res, next) => {
  const data = { ...req.body };

  if (req.file) {
    data.imageUrl = `/uploads/${req.file.filename}`;
  }

  // مش بنسمح بتعديل الحقول دي من الريكوست
  delete data._id;
  delete data.members;

  const gymClass = await GymClass.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!gymClass) {
    return next(new AppError('No class found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { class: gymClass },
  });
});

// DELETE - DELETE /api/v1/classes/:id  (admin only)
exports.deleteClass = catchAsync(async (req, res, next) => {
  const gymClass = await GymClass.findByIdAndDelete(req.params.id);

  if (!gymClass) {
    return next(new AppError('No class found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { class: gymClass },
  });
});
