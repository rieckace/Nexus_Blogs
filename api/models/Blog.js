const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    externalLink: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
