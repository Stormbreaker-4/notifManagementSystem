const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Preference = require('./Preference');
const Event = require('./Event');
const Notification = require('./Notification');
const DeliveryLog = require('./DeliveryLog');
const RefreshToken = require('./RefreshToken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    password: { type: String, required: true },
    mobileNumber: { 
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // optional
                // Indian format: +91 followed by exactly 10 digits
                return /^\+91[0-9]{10}$/.test(v.replace(/\s/g, ''));
            },
            message: 'Mobile number must be in format +911234567890 (+91 followed by 10 digits)'
        }
    },
    role: { type: String, enum: ['student', 'coordinator', 'admin'], default: 'student' },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPwd) {
    return await bcrypt.compare(enteredPwd, this.password);
}

// Pre-save validation for password strength
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    if (this.password.length < 6) {
        return next(new Error('Password must be at least 6 characters long'));
    }
    next();
});

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
