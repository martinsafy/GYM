const express = require('express');
const classController = require('../controllers/class.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const router = express.Router();

// متاحة للكل من غير تسجيل دخول
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);

// الأدمن بس
router.post('/', protect, restrictTo('admin'), uploadImage, classController.createClass);
router.patch('/:id', protect, restrictTo('admin'), uploadImage, classController.updateClass);
router.delete('/:id', protect, restrictTo('admin'), classController.deleteClass);

module.exports = router;
