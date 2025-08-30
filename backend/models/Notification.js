const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    channel: { type: String, enum: ['email', 'push', 'sms', 'whatsapp'], required: true },
    scheduledTime: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    retries: { type: Number, default: 0 }
}, { timestamps: true });

// prevent exact duplicates (user+event+channel)
notificationSchema.index({ eventId: 1, userId: 1, channel: 1 }, { unique: false });

module.exports = mongoose.model('Notification', notificationSchema);
