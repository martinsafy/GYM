const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// كل الراوتس تحت دي لازم تسجيل دخول
router.use(protect);

// الأعضاء
router.get('/classes', userController.getMyClasses);
router.post('/classes', userController.enrollInClass);
router.delete('/classes/:classId', userController.cancelEnrollment);

// الأدمن بس
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.patch('/:id/role', restrictTo('admin'), userController.updateUserRole);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;
