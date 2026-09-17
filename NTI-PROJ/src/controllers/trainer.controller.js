const Trainer = require('../models/trainer.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// GET /api/v1/trainers
exports.getAllTrainers = catchAsync(async (req, res) => {
  const trainers = await Trainer.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: trainers.length,
    data: { trainers },
  });
});

// GET /api/v1/trainers/:id
exports.getTrainerById = catchAsync(async (req, res, next) => {
  const trainer = await Trainer.findById(req.params.id);

  if (!trainer) {
    return next(new AppError('No trainer found with that id', 404));
  }

  res.status(200).json({ status: 'success', data: { trainer } });
});

// POST /api/v1/trainers  (admin only)
exports.createTrainer = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

  const trainer = await Trainer.create(data);

  res.status(201).json({ status: 'success', data: { trainer } });
});

// PATCH /api/v1/trainers/:id  (admin only)
exports.updateTrainer = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
  delete data._id;

  const trainer = await Trainer.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!trainer) {
    return next(new AppError('No trainer found with that id', 404));
  }

  res.status(200).json({ status: 'success', data: { trainer } });
});

// DELETE /api/v1/trainers/:id  (admin only)
exports.deleteTrainer = catchAsync(async (req, res, next) => {
  const trainer = await Trainer.findByIdAndDelete(req.params.id);

  if (!trainer) {
    return next(new AppError('No trainer found with that id', 404));
  }

  res.status(200).json({ status: 'success', data: { trainer } });
});
