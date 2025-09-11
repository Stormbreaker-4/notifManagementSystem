const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const isProd = process.env.NODE_ENV === 'production';

function signAccessToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}
function signRefreshToken(id) {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

function setRefreshCookie(res, token) {
    res.cookie('rt', token, {
        httpOnly: true,
        secure: isProd,             // false on localhost dev, true in prod (HTTPS)
        sameSite: isProd ? 'strict' : 'lax',
        path: '/api/auth/refresh',  // scope cookie to refresh endpoint for safety
        maxAge: 7 * 24 * 60 * 60 * 1000, // align with REFRESH_TTL if 7d
    });
}

async function persistRefresh(userId, rawToken) {
    const payload = jwt.decode(rawToken);
    const expMs = payload?.exp ? payload.exp * 1000 : Date.now() + 7 * 864e5;
    const tokenHash = await bcrypt.hash(rawToken, 10);
    await RefreshToken.create({
        userId,
        tokenHash,
        expiresAt: new Date(expMs),
    });
}

async function revokeRefresh(userId, rawToken, replacedBy = null) {
    // best-effort: find a token by comparing hash
    const all = await RefreshToken.find({ userId, revokedAt: { $exists: false } });
    for (const doc of all) {
        const match = await bcrypt.compare(rawToken, doc.tokenHash);
        if (match) {
            doc.revokedAt = new Date();
            if (replacedBy) doc.replacedBy = replacedBy;
            await doc.save();
            return;
        }
    }
}

async function registerUser(req, res) {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });

        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id);

        await persistRefresh(user._id, refreshToken);
        setRefreshCookie(res, refreshToken);

        return res.status(201).json({
            _id: user._id, name: user.name, email: user.email, role: user.role,
            token: accessToken,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id);

        await persistRefresh(user._id, refreshToken);
        setRefreshCookie(res, refreshToken);

        return res.json({
            _id: user._id, name: user.name, email: user.email, role: user.role,
            token: accessToken,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function refreshAccessToken(req, res) {
    try {
        const cookieRt = req.cookies?.rt;
        if (!cookieRt) return res.status(401).json({ message: 'Missing refresh token' });

        let payload;
        try {
            payload = jwt.verify(cookieRt, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // verify it exists and not revoked
        const docs = await RefreshToken.find({ userId: payload.id, revokedAt: { $exists: false } });
        let found = null;
        for (const d of docs) {
            if (await bcrypt.compare(cookieRt, d.tokenHash)) { found = d; break; }
        }
        if (!found) return res.status(401).json({ message: 'Refresh token not recognized' });
        if (found.expiresAt < new Date()) return res.status(401).json({ message: 'Refresh token expired' });

        // ROTATE: revoke old, issue new refresh
        const newRt = signRefreshToken(payload.id);
        await revokeRefresh(payload.id, cookieRt, 'rotated');
        await persistRefresh(payload.id, newRt);
        setRefreshCookie(res, newRt);

        const user = await User.findById(payload.id).select('_id name email role');
        if (!user) return res.status(401).json({ message: 'User not found' });

        const newAccess = signAccessToken(user._id, user.role);
        return res.json({ token: newAccess, _id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function logoutUser(req, res) {
    try {
        const cookieRt = req.cookies?.rt;
        if (cookieRt) {
            try {
                const payload = jwt.decode(cookieRt);
                if (payload?.id) await revokeRefresh(payload.id, cookieRt, 'logout');
            } catch { }
        }
        // Clear cookie regardless
        res.clearCookie('rt', { path: '/api/auth/refresh' });
        return res.json({ message: 'Logged out' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    // exposing signAccessToken only if you still need it elsewhere:
    generateToken: signAccessToken,
};
