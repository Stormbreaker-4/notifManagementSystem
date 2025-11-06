const Notification = require('../models/Notification');
const DeliveryLog = require('../models/DeliveryLog');
const Preference = require('../models/Preference');
const Event = require('../models/Event');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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

// --- Email sending ---
async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
}

function renderTemplate(html, user, event) {
    // very basic placeholder replacement (server-side authority)
    const map = {
        '{{name}}': user?.name || '',
        '{{email}}': user?.email || '',
        '{{event.title}}': event?.title || '',
        '{{event.date}}': event?.eventDateTime ? new Date(event.eventDateTime).toLocaleString() : '',
        '{{event.venue}}': event?.venue || '',
        '{{event.category}}': (event?.categoryId?.name || '').toUpperCase().replace(/_/g, ' '),
        '{{coordinator.name}}': event?.createdBy?.name || '',
        '{{coordinator.email}}': event?.createdBy?.email || '',
        '{{coordinator.mobile}}': event?.createdBy?.mobileNumber || '',
    };
    let out = String(html || '');
    for (const [k, v] of Object.entries(map)) out = out.split(k).join(v);
    return out;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatBody(message) {
    const msg = String(message || '');
    // If user supplied HTML, don't escape; otherwise preserve newlines
    const looksHtml = msg.includes('<');
    if (looksHtml) return msg;
    return escapeHtml(msg).replace(/\n/g, '<br/>');
}

async function notifyByEmail(req, res) {
    try {
        const eventId = req.params.id;
        const { subject, message } = req.body; // html or text

        const event = await Event.findById(eventId)
            .populate('categoryId', 'name')
            .populate('createdBy', 'name email mobileNumber');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Only admin or the coordinator who created the event may send notifications
        const isCoordinator = req.user.role === 'coordinator';
        if (isCoordinator && String(event.createdBy?._id || event.createdBy) !== String(req.user._id)) {
            console.log(isCoordinator + "\n" + event.createdBy + "\n" + req.user._id);
            return res.status(403).json({ message: 'Only creator coordinator can notify for this event' });
        }

        const prefs = await Preference.find({ categoryId: event.categoryId?._id || event.categoryId, optedIn: true }).lean();
        const userIds = prefs.map(p => p.userId);
        const users = await User.find({ _id: { $in: userIds } }).select('email name');
        const recipients = users.filter(u => !!u.email);
        const skipped = users.length - recipients.length; // missing email

        let sent = 0, failed = 0;
        const failures = [];
        for (const u of recipients) {
            try {
                // create a notification record per recipient for traceability
                const n = await Notification.create({
                    eventId: event._id,
                    userId: u._id,
                    channel: 'email',
                    scheduledTime: new Date(),
                    status: 'pending'
                });

                const footer = `
<hr />
<div style="font-size:13px;color:#444">
  <div><strong>Event:</strong> ${event.title}</div>
  <div><strong>Date & Time:</strong> ${new Date(event.eventDateTime).toLocaleString()}</div>
  <div><strong>Category:</strong> ${(event.categoryId?.name || '').toUpperCase().replace(/_/g, ' ')}</div>
  <div style="margin-top:8px"><strong>Coordinator:</strong> ${event.createdBy?.name || ''}</div>
  ${event.createdBy?.email ? `<div>${event.createdBy.email}</div>` : ''}
  ${event.createdBy?.mobileNumber ? `<div>${event.createdBy.mobileNumber}</div>` : ''}
  <div style="margin-top:8px">This message was sent via VIT Events notifications.</div>
  <div>To manage your preferences, visit your profile in the portal.</div>
  <div style="font-size:12px;color:#777;margin-top:6px">Do not reply to this automated email.</div>
  </div>`;

                const rendered = formatBody(message || `Update for ${event.title}`);
                const htmlBody = renderTemplate(rendered, u, event) + footer;
                await sendEmail(u.email, subject || `Update: ${event.title}`, htmlBody);

                await Notification.findByIdAndUpdate(n._id, { status: 'sent' });
                sent++;
                await DeliveryLog.create({ notificationId: n._id, successFlag: true, errorMessage: null });
            } catch (e) {
                try {
                    // if notification exists in this iteration, mark failed; otherwise create one to attach log
                    const n = await Notification.create({
                        eventId: event._id,
                        userId: u._id,
                        channel: 'email',
                        scheduledTime: new Date(),
                        status: 'failed'
                    });
                    await DeliveryLog.create({ notificationId: n._id, successFlag: false, errorMessage: e.message });
                } catch { }
                failed++;
                failures.push({ userId: String(u._id), email: u.email, error: e.message });
            }
        }

        const summary = { attempted: recipients.length, sent, failed, skipped, failures };
        console.log(`[NotifyEmail] Event:${event._id} Category:${event.categoryId?.name} ->`, summary);
        return res.json(summary);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function testEmail(req, res) {
    try {
        const eventId = req.params.id;
        const { to, subject, message } = req.body;
        if (!to) return res.status(400).json({ message: 'Missing test recipient "to"' });

        const event = await Event.findById(eventId)
            .populate('categoryId', 'name')
            .populate('createdBy', 'name email mobileNumber');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ownership check
        const isCoordinator = req.user.role === 'coordinator';
        if (isCoordinator && String(event.createdBy?._id || event.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Only creator coordinator can notify for this event' });
        }

        const fakeUser = { name: 'Student', email: to };
        const footer = `
<hr />
<div style="font-size:13px;color:#444">
  <div><strong>Event:</strong> ${event.title}</div>
  <div><strong>Date & Time:</strong> ${new Date(event.eventDateTime).toLocaleString()}</div>
  <div><strong>Category:</strong> ${(event.categoryId?.name || '').toUpperCase().replace(/_/g, ' ')}</div>
  <div style="margin-top:8px"><strong>Coordinator:</strong> ${event.createdBy?.name || ''}</div>
  ${event.createdBy?.email ? `<div>${event.createdBy.email}</div>` : ''}
  ${event.createdBy?.mobileNumber ? `<div>${event.createdBy.mobileNumber}</div>` : ''}
  <div style="margin-top:8px">This message was sent via VIT Events notifications.</div>
  <div>To manage your preferences, visit your profile in the portal.</div>
  <div style="font-size:12px;color:#777;margin-top:6px">Do not reply to this automated email.</div>
  </div>`;
        const rendered = formatBody(message || `Update for ${event.title}`);
        const htmlBody = renderTemplate(rendered, fakeUser, event) + footer;
        await sendEmail(to, subject || `Test: ${event.title}`, htmlBody);
        return res.json({ attempted: 1, sent: 1, failed: 0, skipped: 0, failures: [] });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getNotifications, updateNotificationStatus, logDeliveryAttempt, notifyByEmail, testEmail };
