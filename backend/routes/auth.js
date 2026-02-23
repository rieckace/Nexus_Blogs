const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

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
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email || '',
            location: user.location || '',
            phone: user.phone || '',
            bio: user.bio || '',
            avatar: user.avatar || '',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Logout Route (stateless)
router.post('/logout', async (req, res) => {
    // This app currently does not use server-issued sessions/cookies.
    // Frontend clears its local auth state; backend returns 200 for a clean UX.
    res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
