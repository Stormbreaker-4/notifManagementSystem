const Notification = require('../models/Notification');
const DeliveryLog = require('../models/DeliveryLog');

async function getNotifications(req, res) {
    try {
        const notifications = await Notification.find()
            .populate('userId', 'name email mobileNumber')
            .populate('eventId', 'title eventDateTime');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateNotificationStatus(req, res) {
    try {
        const { status, retries } = req.body;
        const updated = await Notification.findByIdAndUpdate(
            req.params.id,
            { status, retries },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// logging a delivery attempt
async function logDeliveryAttempt(req, res) {
    try {
        const { notificationId, successFlag, errorMessage } = req.body;
        const log = new DeliveryLog({
            notificationId,
            successFlag,
            errorMessage
        });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { getNotifications, updateNotificationStatus, logDeliveryAttempt };
