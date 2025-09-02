const User = require('../models/User');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
    try {
        if (!req.body.password || String(req.body.password).trim() === '') {
            return res.status(400).json({ message: 'Password is required' });
        }
        const hashed = await bcrypt.hash(req.body.password, 10);
        const payload = { ...req.body, password: hashed };

        const user = new User(payload);
        await user.save();

        const safe = user.toObject();
        delete safe.password;
        res.status(201).json(safe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let allowedFields = ['name', 'email'];
        if (req.user.role === 'admin') {
            allowedFields = [...allowedFields, 'role'];
        }
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        }

        if (req.body.password && String(req.body.password).trim() !== '') {
            user.password = await bcrypt.hash(String(req.body.password), 10);
        }

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `User named '${deletedUser.name}' deleted` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
