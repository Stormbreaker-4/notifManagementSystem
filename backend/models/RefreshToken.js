const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedBy: { type: String }, // token id or hash marker
}, { timestamps: true });

refreshTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
