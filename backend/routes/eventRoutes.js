const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', eventController.getEvents);

router.get('/:id', eventController.getEventById);

router.post('/', protect, authorizeRoles('admin', 'coordinator'), eventController.createEvent);

router.post('/:id/register', protect, authorizeRoles('student'), eventController.registerForEvent);

// Update/delete by admin or the coordinator who created the event
router.put('/:id', protect, authorizeRoles('admin', 'coordinator'), eventController.updateEvent);
router.delete('/:id', protect, authorizeRoles('admin', 'coordinator'), eventController.deleteEvent);

// List registrations; CSV export supported with ?format=csv
router.get('/:id/registrations', protect, authorizeRoles('admin', 'coordinator'), eventController.listRegistrations);

module.exports = router;
