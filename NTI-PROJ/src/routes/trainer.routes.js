const express = require('express');
const trainerController = require('../controllers/trainer.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);

router.post('/', protect, restrictTo('admin'), uploadImage, trainerController.createTrainer);
router.patch('/:id', protect, restrictTo('admin'), uploadImage, trainerController.updateTrainer);
router.delete('/:id', protect, restrictTo('admin'), trainerController.deleteTrainer);

module.exports = router;
