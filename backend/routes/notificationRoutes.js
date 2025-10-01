const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admin and coordinators can view/update notifications; delivery workers could be added later
router.get('/', authorizeRoles('admin', 'coordinator'), notificationController.getNotifications);
router.put('/:id/status', authorizeRoles('admin', 'coordinator'), notificationController.updateNotificationStatus);
router.post('/log', authorizeRoles('admin', 'coordinator'), notificationController.logDeliveryAttempt);

module.exports = router;
