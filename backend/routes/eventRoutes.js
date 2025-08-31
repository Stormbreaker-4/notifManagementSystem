const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', eventController.getEvents);

router.post('/', protect, authorizeRoles('admin', 'coordinator'), eventController.createEvent);

module.exports = router;
