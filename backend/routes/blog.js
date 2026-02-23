// routes/blog.js
const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// Create Blog Route
router.post('/create', async (req, res) => {
    const { title, content, author, category, externalLink } = req.body;
    if (!title || !content || !author || !category) {
        return res.status(400).json({ message: 'Please fill all the required fields' });
    }
    try {
        const newBlog = new Blog({
            title,
            content,
            author,
            category,
            externalLink,
        });
        await newBlog.save();
        res.status(200).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Error creating blog, please try again' });
    }
});

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// Search blogs
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const blogs = await Blog.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Error searching blogs' });
    }
});

// Delete blog
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Error deleting blog' });
    }
});

// Update blog
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, category, externalLink } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, content, author, category, externalLink },
            { new: true }
        );
        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Error updating blog' });
    }
});

module.exports = router;