const express = require('express');
const catgoryController = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', catgoryController.createCategory);

router.get('/:type', protect, authorizeRoles('admin', 'coordinator'),  catgoryController.getCategoryByType);

module.exports = router;
