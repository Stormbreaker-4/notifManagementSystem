const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/', notificationController.getNotifications);
router.put('/:id/status', notificationController.updateNotificationStatus);
router.post('/log', notificationController.logDeliveryAttempt);

module.exports = router;
