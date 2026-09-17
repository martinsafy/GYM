const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const classRoutes = require('./routes/class.routes');
const trainerRoutes = require('./routes/trainer.routes');
const userRoutes = require('./routes/user.routes');
const { notFound, globalErrorHandler } = require('./middlewares/error.middleware');

const app = express();

// يسمح للفرونت (Angular) إنه يكلّم السيرفر
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true,
  })
);

// قراءة الـ JSON والـ form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الصور المرفوعة تبقى متاحة على http://localhost:5000/uploads/xxx.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// لوج بسيط لكل ريكوست
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// صفحة اختبار
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Gym Management API is running' });
});

// الراوتس
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/users', userRoutes);

// معالجة الأخطاء (لازم تكون في الآخر)
app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;
