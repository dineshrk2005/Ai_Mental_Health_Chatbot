const mongoose = require('mongoose');

const moodSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        emotion: {
            type: String, // e.g. 'Happy', 'Anxious', 'Neutral'
            required: true
        },
        note: {
            type: String,
            maxLength: 500
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;
