const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Preference = require('./Preference');
const Event = require('./Event');
const Notification = require('./Notification');
const DeliveryLog = require('./DeliveryLog');
const RefreshToken = require('./RefreshToken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    role: { type: String, enum: ['student', 'coordinator', 'admin'], default: 'student' },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPwd) {
    return await bcrypt.compare(enteredPwd, this.password);
}

module.exports = mongoose.model('User', userSchema);

// Post middleware to handle cascade cleanup when a user document is removed via .remove()
userSchema.post('findOneAndDelete', async function (doc) {
    try {
        if (!doc) return;
        const userId = doc._id;
        const userNotifs = await Notification.find({ userId }).select('_id');
        const notifIds = userNotifs.map(n => n._id);
        await Promise.all([
            Preference.deleteMany({ userId }),
            Event.updateMany({}, { $pull: { registrations: userId } }),
            DeliveryLog.deleteMany({ notificationId: { $in: notifIds } }),
            Notification.deleteMany({ userId }),
            RefreshToken.deleteMany({ userId })
        ]);
    } catch (e) {
        // log but don't block deletion
        console.error('User cascade cleanup failed:', e?.message);
    }
});
