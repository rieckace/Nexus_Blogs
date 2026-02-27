const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Email is used for authentication. We keep it optional to avoid breaking
    // legacy documents that may have empty email values.
    email: { type: String, default: '', trim: true, lowercase: true },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    // Stored as a data URL (e.g. 'data:image/png;base64,...') for simplicity.
    avatar: { type: String, default: '' },

    // If using refresh tokens (JWT cookie auth), store a hash to support logout/invalidation.
    refreshTokenHash: { type: String, default: '' },
});

// Enforce uniqueness only for non-empty email values.
UserSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $type: 'string', $ne: '' } } }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
