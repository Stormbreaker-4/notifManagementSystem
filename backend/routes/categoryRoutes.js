const express = require('express');
const catgoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/:type', catgoryController.getCategoryByType);
router.post('/', catgoryController.createCategory);

module.exports = router;
