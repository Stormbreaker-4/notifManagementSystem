const jwt = require('jsonwebtoken');
const User = require("../models/User");

const protect = async (req, res, next) => {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized: Missing token' });
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

module.exports = { protect, authorizeRoles };
