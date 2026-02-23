const express = require('express');
const multer = require('multer');
const User = require('../models/User');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
});

function toSafeUser(userDoc) {
    if (!userDoc) return null;
    return {
        id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email || '',
        location: userDoc.location || '',
        phone: userDoc.phone || '',
        bio: userDoc.bio || '',
        avatar: userDoc.avatar || '',
    };
}

// Fetch user profile
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user: toSafeUser(user) });
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// Update user profile (username is not editable here)
router.put('/:username', async (req, res) => {
    try {
        const { email, location, phone, bio } = req.body || {};
        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            {
                email: email ?? '',
                location: location ?? '',
                phone: phone ?? '',
                bio: bio ?? '',
            },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user: toSafeUser(updatedUser) });
    } catch (error) {
        console.error('Failed to update profile:', error);
        return res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Upload avatar (stored as data URL string)
router.post('/:username/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'Only image files are allowed' });
        }

        const base64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            { avatar: dataUrl },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ avatarUrl: updatedUser.avatar });
    } catch (error) {
        console.error('Failed to upload avatar:', error);
        return res.status(500).json({ message: 'Failed to upload avatar' });
    }
});

module.exports = router;
