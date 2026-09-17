const mongoose = require('mongoose');

const gymClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Class title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must be at most 100 characters'],
    },

    // اسم المدرب كنص (سهل للفرونت)
    trainer: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true,
    },

    // ربط اختياري بموديل المدربين (علاقة بين الجدولين)
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      default: null,
    },

    description: {
      type: String,
      maxlength: [1000, 'Description must be at most 1000 characters'],
      default: '',
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // مدة الحصة بالدقايق
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0, 'Duration cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['cardio', 'strength', 'yoga', 'crossfit', 'boxing', 'pilates'],
        message: '{VALUE} is not a valid category',
      },
    },

    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: '{VALUE} is not a valid level',
      },
    },

    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },

    // أقصى عدد للمشتركين في الحصة
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: 20,
    },

    // عدد المشتركين الحاليين
    members: {
      type: Number,
      min: [0, 'Members cannot be negative'],
      default: 0,
    },

    // مواعيد الحصة في الأسبوع
    schedule: {
      type: String,
      default: '',
      trim: true,
    },

    imageUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// فيلد محسوب: فاضل كام مكان
gymClassSchema.virtual('availableSeats').get(function () {
  return Math.max(this.capacity - this.members, 0);
});

gymClassSchema.set('toJSON', { virtuals: true });
gymClassSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('GymClass', gymClassSchema);
