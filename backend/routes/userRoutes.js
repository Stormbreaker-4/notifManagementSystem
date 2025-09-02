const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

/**
 * Admin-only collection operations
 * - create and get all the users
 * - delete a user
 */
router.post('/', authorizeRoles('admin'), userController.createUser);
router.get('/', authorizeRoles('admin'), userController.getUsers);

/**
 * Item operations
 * - students can only access/update themselves
 * - admin can access/update anyone
*/

// GET  /api/users/:id
router.get('/:id', authorizeRoles('student', 'admin'), (req, res, next) => {
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Students can only view their own profile' });
    }
    userController.getUserById(req, res, next);
});

// PUT  /api/users/:id
router.put('/:id', authorizeRoles('student', 'admin'), (req, res, next) => {
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Students can only update their own profile' });
    }
    // students cannot change role
    if (req.user.role !== 'admin' && 'role' in req.body) {
        return res.status(403).json({ message: 'Only admin can change role' });
    }
    userController.updateUser(req, res, next);
});

router.delete('/:id', authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
