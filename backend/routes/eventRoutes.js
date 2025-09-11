const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', eventController.getEvents);

router.get('/:id', eventController.getEventById);

router.post('/', protect, authorizeRoles('admin', 'coordinator'), eventController.createEvent);

router.post('/:id/register', protect, authorizeRoles('student'), eventController.registerForEvent);

module.exports = router;
