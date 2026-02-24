const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    // Stored as a data URL (e.g. 'data:image/png;base64,...') for simplicity.
    avatar: { type: String, default: '' },

    // If using refresh tokens (JWT cookie auth), store a hash to support logout/invalidation.
    refreshTokenHash: { type: String, default: '' },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
