const express = require('express');
const preferenceController = require('../controllers/preferenceController');
const router = express.Router();

router.get('/:userId', preferenceController.getPreferences);
router.put('/:userId', preferenceController.updatePreferences);

module.exports = router;
