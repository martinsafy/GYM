const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [80, 'Name must be at most 80 characters'],
    },

    speciality: {
      type: String,
      required: [true, 'Speciality is required'],
      enum: ['cardio', 'strength', 'yoga', 'crossfit', 'boxing', 'pilates'],
    },

    bio: {
      type: String,
      maxlength: [1000, 'Bio must be at most 1000 characters'],
      default: '',
    },

    experienceYears: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0,
    },

    phone: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
