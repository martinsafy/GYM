const express = require('express');
const authController = require('../controllers/auth.controller');
const { uploadImage } = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', uploadImage, authController.signup);
router.post('/signin', authController.signin);
router.get('/me', protect, authController.getMe);

module.exports = router;
