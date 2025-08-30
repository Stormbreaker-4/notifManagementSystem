const Event = require('../models/Event');
const User = require('../models/User');
const Preference = require('../models/Preference');
const Notification = require('../models/Notification');
const Category = require('../models/Category');

const createEvent = async (req, res) => {
    try {
        const payload = req.body;

        const category = await Category.findById(payload.categoryId);
        if (!category)
            return res.status(404).json({ message: 'Invalid category' });

        const event = new Event({
            title: payload.title,
            description: payload.description,
            eventDateTime: payload.eventDateTime,
            venue: payload.venue,
            categoryId: payload.categoryId,
            createdBy: payload.createdBy
        });

        await event.save();

        const preferences = await Preference.find({
            categoryId: payload.categoryId,
            optedIn: true
        }).lean();


        // create notification records for each user (channel selection logic can be applied [Not Applied till now])
        const notifications = [];
        for (const pref of preferences) {
            // decide channels for this user;
            // for testing first and simplicity, create an email notification entry
            notifications.push({
                eventId: event._id,
                userId: pref.userId,
                channel: 'email',
                scheduledTime: new Date()
            });
            // have to extend to push/sms/whatsapp later
        }

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            // optionally trigger immediate delivery worker here
        }

        res.status(201).json({ event, createdNotifications: notifications.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error.message);
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'name email')
            .populate('categoryId', 'name');

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// other functions: getEventById, updateEvent (should re-trigger notifications if event updated), deleteEvent

module.exports = { createEvent, getEvents };
