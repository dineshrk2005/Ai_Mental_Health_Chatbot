const asyncHandler = require('express-async-handler');
const Mood = require('../models/Mood');

// @desc    Log a new mood entry
// @route   POST /api/moods
// @access  Private
const createMood = asyncHandler(async (req, res) => {
    const { score, emotion, note } = req.body;

    const mood = await Mood.create({
        user: req.user._id,
        score,
        emotion,
        note
    });

    res.status(201).json(mood);
});

// @desc    Get user mood history
// @route   GET /api/moods
// @access  Private
const getMoods = asyncHandler(async (req, res) => {
    // Optional: limit to last 7 days or 30 days
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
});

module.exports = { createMood, getMoods };
