const express = require('express');
const preferenceController = require('../controllers/preferenceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.get('/:userId', authorizeRoles('student', 'admin'), (req, res, next) => {    
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: 'Students can only view their own preferences' });
    }
    preferenceController.getPreferences(req, res, next);
});

router.put('/:userId', authorizeRoles('student', 'admin'), (req, res, next) => {
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: 'Students can only update their own preferences' });
    }
    preferenceController.updatePreferences(req, res, next);
});

module.exports = router;
