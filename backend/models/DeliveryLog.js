const mongoose = require('mongoose');

const deliveryLogSchema = new mongoose.Schema({
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
    attemptTime: { type: Date, default: Date.now },
    successFlag: { type: Boolean, required: true },
    errorMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryLog', deliveryLogSchema);
