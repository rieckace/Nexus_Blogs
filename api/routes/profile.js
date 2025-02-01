// const express = require('express');
// const multer = require('multer');
// const User = require('../models/User'); // Assuming User model is in models directory
// const router = express.Router();

// // Fetch User Profile
// router.get('/:username', async (req, res) => {
//     try {
//         const user = await User.findOne({ username: req.params.username });
//         if (!user) return res.status(404).json({ error: 'User not found' });
//         res.json({ user });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch profile' });
//     }
// });

// // Update User Profile
// router.put('/update', async (req, res) => {
//     try {
//         const { username, email, location, phone, bio } = req.body;
//         const updatedUser = await User.findOneAndUpdate(
//             { username },
//             { email, location, phone, bio },
//             { new: true }
//         );
//         res.json({ user: updatedUser });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to update profile' });
//     }
// });

// // Avatar Upload
// const storage = multer.diskStorage({
//     destination: 'uploads/',
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({ storage });

// router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
//     try {
//         const avatarUrl = `/uploads/${req.file.filename}`;
//         const updatedUser = await User.findOneAndUpdate(
//             { username: req.body.username },
//             { avatar: avatarUrl },
//             { new: true }
//         );
//         res.json({ avatarUrl });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to upload avatar' });
//     }
// });

// module.exports = router;
