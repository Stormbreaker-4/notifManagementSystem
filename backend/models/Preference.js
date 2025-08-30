const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    optedIn: { type: Boolean, default: true },
    fest_updates: { type: Boolean, default: true }
}, { timestamps: true });

preferenceSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

module.exports = mongoose.model('Preference', preferenceSchema);
