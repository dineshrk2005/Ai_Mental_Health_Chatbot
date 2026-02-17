const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            enum: ['user', 'ai'],
            required: true
        },
        sentiment: {
            type: String,
            default: 'neutral'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
