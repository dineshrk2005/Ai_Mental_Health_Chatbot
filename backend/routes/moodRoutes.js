const express = require('express');
const router = express.Router();
const { createMood, getMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createMood)
    .get(protect, getMoods);

module.exports = router;
