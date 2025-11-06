const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admin and coordinators can view/update notifications; delivery workers could be added later
router.get('/', authorizeRoles('admin', 'coordinator'), notificationController.getNotifications);
router.put('/:id/status', authorizeRoles('admin', 'coordinator'), notificationController.updateNotificationStatus);
router.post('/log', authorizeRoles('admin', 'coordinator'), notificationController.logDeliveryAttempt);

// Send email notifications for an event to opted-in users
router.post('/events/:id/email', authorizeRoles('admin', 'coordinator'), notificationController.notifyByEmail);
router.post('/events/:id/email/test', authorizeRoles('admin', 'coordinator'), notificationController.testEmail);

module.exports = router;
