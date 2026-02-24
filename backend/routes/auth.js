const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

function getAccessSecret() {
    return process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
}

function getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

function cookieOptions(maxAgeMs) {
    return {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAgeMs,
        path: '/',
    };
}

function signAccessToken(user) {
    return jwt.sign(
        { sub: String(user._id), username: user.username },
        getAccessSecret(),
        { expiresIn: '15m' }
    );
}

function signRefreshToken(user) {
    return jwt.sign(
        { sub: String(user._id), tokenType: 'refresh' },
        getRefreshSecret(),
        { expiresIn: '7d' }
    );
}

function userResponse(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email || '',
        location: user.location || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
    };
}

// Register Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        user.refreshTokenHash = sha256(refreshToken);
        await user.save();

        res.cookie('access_token', accessToken, cookieOptions(15 * 60 * 1000));
        res.cookie('refresh_token', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
        res.status(200).json(userResponse(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Session info
router.get('/me', async (req, res) => {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const payload = jwt.verify(token, getAccessSecret());
        const user = await User.findById(payload.sub);
        if (!user) return res.status(401).json({ message: 'Not authenticated' });
        return res.status(200).json(userResponse(user));
    } catch {
        return res.status(401).json({ message: 'Not authenticated' });
    }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const payload = jwt.verify(token, getRefreshSecret());
        if (payload.tokenType !== 'refresh') {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await User.findById(payload.sub);
        if (!user) return res.status(401).json({ message: 'Not authenticated' });
        if (!user.refreshTokenHash || user.refreshTokenHash !== sha256(token)) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const accessToken = signAccessToken(user);
        res.cookie('access_token', accessToken, cookieOptions(15 * 60 * 1000));
        return res.status(200).json({ ok: true });
    } catch {
        return res.status(401).json({ message: 'Not authenticated' });
    }
});

// Logout Route
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies?.refresh_token;
        if (token) {
            try {
                const payload = jwt.verify(token, getRefreshSecret());
                const user = await User.findById(payload.sub);
                if (user) {
                    user.refreshTokenHash = '';
                    await user.save();
                }
            } catch {
                // ignore
            }
        }
    } catch {
        // ignore
    }

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
