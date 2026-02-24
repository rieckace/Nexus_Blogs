const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    category: { type: String, required: true },
    externalLink: { type: String, required: false },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    commentCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
