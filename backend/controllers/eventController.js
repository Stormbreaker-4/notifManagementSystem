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
            createdBy: req.user?._id || payload.createdBy
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

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email role mobileNumber')   // include coordinator info (with contact)
            .populate('categoryId', 'name');           // include category details

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Prevent duplicate registration
        if (event.registrations.includes(userId)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        event.registrations.push(userId);
        await event.save();

        res.status(200).json({ message: 'Successfully registered for the event', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update event, and re-generate notifications if category/time/title/venue changed
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const isCoordinator = req.user.role === 'coordinator';
        if (isCoordinator && String(event.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Only creator coordinator can update this event' });
        }

        const before = {
            title: event.title,
            description: event.description,
            eventDateTime: event.eventDateTime?.toISOString?.(),
            venue: event.venue,
            categoryId: String(event.categoryId)
        };

        if (updates.title !== undefined) event.title = updates.title;
        if (updates.description !== undefined) event.description = updates.description;
        if (updates.eventDateTime !== undefined) event.eventDateTime = updates.eventDateTime;
        if (updates.venue !== undefined) event.venue = updates.venue;
        if (updates.categoryId !== undefined) event.categoryId = updates.categoryId;

        await event.save();

        const after = {
            title: event.title,
            description: event.description,
            eventDateTime: event.eventDateTime?.toISOString?.(),
            venue: event.venue,
            categoryId: String(event.categoryId)
        };

        const impactfulChange = (
            before.title !== after.title ||
            before.venue !== after.venue ||
            before.eventDateTime !== after.eventDateTime ||
            before.categoryId !== after.categoryId
        );

        let regenerated = 0;
        if (impactfulChange) {
            // Simple strategy: remove pending notifications for this event and re-create based on current preferences
            await Notification.deleteMany({ eventId: event._id, status: { $in: ['pending'] } });

            const preferences = await Preference.find({ categoryId: event.categoryId, optedIn: true }).lean();
            const notifications = preferences.map(pref => ({
                eventId: event._id,
                userId: pref.userId,
                channel: 'email',
                scheduledTime: new Date()
            }));
            if (notifications.length) {
                await Notification.insertMany(notifications);
                regenerated = notifications.length;
            }
        }

        res.json({ event, regeneratedNotifications: regenerated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete event and associated pending notifications
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const isCoordinator = req.user.role === 'coordinator';
        if (isCoordinator && String(event.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Only creator coordinator can delete this event' });
        }

        await Notification.deleteMany({ eventId: id, status: { $in: ['pending'] } });
        await Event.findByIdAndDelete(id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List registrations for an event; ?format=csv to export
const listRegistrations = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('registrations', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const isCoordinator = req.user.role === 'coordinator';
        if (isCoordinator && String(event.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Only creator coordinator can view registrations' });
        }

        const format = (req.query.format || '').toLowerCase();
        const rows = event.registrations.map(u => ({ name: u.name, email: u.email }));

        if (format === 'csv') {
            const header = 'name,email\n';
            const csv = header + rows.map(r => `${r.name},${r.email}`).join('\n');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="event_${id}_registrations.csv"`);
            return res.send(csv);
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEvent, getEvents, getEventById, registerForEvent, updateEvent, deleteEvent, listRegistrations };
