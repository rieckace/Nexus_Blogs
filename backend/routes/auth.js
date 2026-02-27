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

function isHttpsRequest(req) {
    if (req.secure) return true;
    const xfProto = req.headers['x-forwarded-proto'];
    if (typeof xfProto === 'string') {
        return xfProto.split(',')[0].trim().toLowerCase() === 'https';
    }
    return false;
}

function cookieOptions(req, maxAgeMs) {
    const desiredSameSiteRaw = process.env.COOKIE_SAMESITE;
    const desiredSameSite = typeof desiredSameSiteRaw === 'string' ? desiredSameSiteRaw.trim().toLowerCase() : '';
    const sameSite = desiredSameSite || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
    const secure = sameSite === 'none' ? true : isHttpsRequest(req);

    return {
        httpOnly: true,
        sameSite,
        secure,
        maxAge: maxAgeMs,
        path: '/',
    };
}

function signAccessToken(user) {
    return jwt.sign(
        { sub: String(user._id), username: user.username, email: user.email || '' },
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

function normalizeEmail(email) {
    if (typeof email !== 'string') return '';
    return email.trim().toLowerCase();
}

function isValidEmail(email) {
    // Minimal email sanity check (avoid over-restricting).
    return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

function usernameBaseFromEmail(email) {
    const local = String(email || '').split('@')[0] || 'user';
    const cleaned = local
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    const base = cleaned || 'user';
    return base.slice(0, 20);
}

async function generateUniqueUsername(base) {
    const safeBase = (base || 'user').slice(0, 20);
    // Try base first, then append a short suffix.
    const candidates = [safeBase];
    for (let i = 0; i < 6; i++) {
        candidates.push(`${safeBase}_${crypto.randomBytes(2).toString('hex')}`);
    }

    for (const candidate of candidates) {
        // eslint-disable-next-line no-await-in-loop
        const exists = await User.findOne({ username: candidate });
        if (!exists) return candidate;
    }
    // Fallback: extremely unlikely
    return `${safeBase}_${crypto.randomBytes(4).toString('hex')}`;
}

// Register Route
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body || {};
    try {
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: 'Valid email is required' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingEmail = await User.findOne({ email: normalizedEmail });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        let finalUsername = typeof username === 'string' ? username.trim() : '';
        if (!finalUsername) {
            finalUsername = await generateUniqueUsername(usernameBaseFromEmail(normalizedEmail));
        } else {
            const existingUsername = await User.findOne({ username: finalUsername });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: finalUsername,
            email: normalizedEmail,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password, username } = req.body || {};
    try {
        const normalizedEmail = normalizeEmail(email);
        const user = normalizedEmail
            ? await User.findOne({ email: normalizedEmail })
            : await User.findOne({ username });
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

        res.cookie('access_token', accessToken, cookieOptions(req, 15 * 60 * 1000));
        res.cookie('refresh_token', refreshToken, cookieOptions(req, 7 * 24 * 60 * 60 * 1000));
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
        res.cookie('access_token', accessToken, cookieOptions(req, 15 * 60 * 1000));
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

    const desiredSameSiteRaw = process.env.COOKIE_SAMESITE;
    const desiredSameSite = typeof desiredSameSiteRaw === 'string' ? desiredSameSiteRaw.trim().toLowerCase() : '';
    const sameSite = desiredSameSite || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
    const secure = sameSite === 'none' ? true : isHttpsRequest(req);
    const clearOpts = { path: '/', sameSite, secure };
    res.clearCookie('access_token', clearOpts);
    res.clearCookie('refresh_token', clearOpts);
    res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
