// routes/blog.js
const express = require('express');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

async function canReadBlog(req, blog) {
    if (!blog) return false;
    if (blog.visibility !== 'private') return true;

    const userId = req.auth?.sub;
    const username = req.auth?.username;
    if (!userId && !username) return false;

    return (blog.authorId && String(blog.authorId) === String(userId)) ||
        (!blog.authorId && blog.author === username);
}

function toBlogDto(blogDoc, auth) {
    const obj = blogDoc.toObject();
    const userId = auth?.sub ? String(auth.sub) : null;
    const username = auth?.username || null;

    const authorId = obj.authorId ? String(obj.authorId) : null;
    const isOwner = (userId && authorId && authorId === userId) ||
        (username && !authorId && obj.author === username);

    const likedBy = Array.isArray(obj.likedBy) ? obj.likedBy.map(String) : [];
    const bookmarkedBy = Array.isArray(obj.bookmarkedBy) ? obj.bookmarkedBy.map(String) : [];

    return {
        ...obj,
        isOwner,
        likeCount: likedBy.length,
        bookmarkCount: bookmarkedBy.length,
        commentCount: typeof obj.commentCount === 'number' ? obj.commentCount : 0,
        isLiked: userId ? likedBy.includes(userId) : false,
        isBookmarked: userId ? bookmarkedBy.includes(userId) : false,
    };
}

// Create Blog Route
router.post('/create', requireAuth, async (req, res) => {
    const { title, content, category, externalLink, visibility } = req.body;
    if (!title || !content || !category) {
        return res.status(400).json({ message: 'Please fill all the required fields' });
    }
    try {
        const author = req.auth?.username;
        const authorId = req.auth?.sub;

        const newBlog = new Blog({
            title,
            content,
            author,
            authorId,
            category,
            externalLink,
            visibility: visibility === 'private' ? 'private' : 'public',
            likedBy: [],
            bookmarkedBy: [],
            commentCount: 0,
        });
        await newBlog.save();
        res.status(200).json({ message: 'Blog created successfully', blog: toBlogDto(newBlog, req.auth) });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Error creating blog, please try again' });
    }
});

// Public feed (public posts only)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const blogs = await Blog.find({ visibility: 'public' }).sort({ createdAt: -1 });
        res.status(200).json({ blogs: blogs.map((b) => toBlogDto(b, req.auth)) });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// My blogs (public + private for authenticated user)
router.get('/mine', requireAuth, async (req, res) => {
    try {
        const userId = req.auth.sub;
        const username = req.auth.username;

        const blogs = await Blog.find({
            $or: [
                { authorId: userId },
                { authorId: null, author: username },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json({ blogs: blogs.map((b) => toBlogDto(b, req.auth)) });
    } catch (error) {
        console.error('Error fetching my blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// Saved posts (bookmarks)
router.get('/bookmarks', requireAuth, async (req, res) => {
    try {
        const userId = String(req.auth.sub);
        const username = req.auth.username;

        const blogs = await Blog.find({ bookmarkedBy: userId }).sort({ createdAt: -1 });
        const readable = [];
        for (const b of blogs) {
            // Safety: don't leak private posts you can't access
            // (in practice, private posts won't be bookmarkable by non-owners).
            // eslint-disable-next-line no-await-in-loop
            if (await canReadBlog(req, b)) readable.push(b);
        }

        // If there are legacy posts without authorId, owner is based on username
        const dtos = readable.map((b) => toBlogDto(b, { sub: userId, username }));
        res.status(200).json({ blogs: dtos });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});

// Search blogs
router.get('/search', optionalAuth, async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.auth?.sub;
        const username = req.auth?.username;

        const textFilter = {
            $or: [
                { title: { $regex: query || '', $options: 'i' } },
                { content: { $regex: query || '', $options: 'i' } },
                { author: { $regex: query || '', $options: 'i' } },
            ],
        };

        const visibilityFilter = userId
            ? {
                $or: [
                    { visibility: 'public' },
                    { authorId: userId },
                    { authorId: null, author: username },
                ],
            }
            : { visibility: 'public' };

        const blogs = await Blog.find({ $and: [visibilityFilter, textFilter] }).sort({ createdAt: -1 });
        res.status(200).json({ blogs: blogs.map((b) => toBlogDto(b, req.auth)) });
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Error searching blogs' });
    }
});

// Delete blog
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const userId = req.auth.sub;
        const username = req.auth.username;
        const isOwner = (blog.authorId && String(blog.authorId) === String(userId)) ||
            (!blog.authorId && blog.author === username);
        if (!isOwner) return res.status(403).json({ message: 'Not allowed' });

        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Error deleting blog' });
    }
});

// Update blog
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await Blog.findById(id);
        if (!existing) return res.status(404).json({ message: 'Blog not found' });

        const userId = req.auth.sub;
        const username = req.auth.username;
        const isOwner = (existing.authorId && String(existing.authorId) === String(userId)) ||
            (!existing.authorId && existing.author === username);
        if (!isOwner) return res.status(403).json({ message: 'Not allowed' });

        const { title, content, category, externalLink, visibility } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                ...(typeof title === 'string' ? { title } : null),
                ...(typeof content === 'string' ? { content } : null),
                ...(typeof category === 'string' ? { category } : null),
                ...(typeof externalLink === 'string' ? { externalLink } : null),
                ...(visibility === 'public' || visibility === 'private' ? { visibility } : null),
            },
            { new: true }
        );
        res.status(200).json({ message: 'Blog updated successfully', blog: toBlogDto(updatedBlog, req.auth) });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Error updating blog' });
    }
});

// Like / Unlike
router.post('/:id/like', requireAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const allowed = await canReadBlog(req, blog);
        if (!allowed) return res.status(403).json({ message: 'Not allowed' });

        const userId = String(req.auth.sub);
        const likedBy = Array.isArray(blog.likedBy) ? blog.likedBy.map(String) : [];

        const isLiked = likedBy.includes(userId);
        if (isLiked) {
            blog.likedBy = blog.likedBy.filter((id) => String(id) !== userId);
        } else {
            blog.likedBy.push(userId);
        }

        await blog.save();
        return res.status(200).json({ blog: toBlogDto(blog, req.auth) });
    } catch (error) {
        console.error('Error toggling like:', error);
        return res.status(500).json({ message: 'Error toggling like' });
    }
});

// Bookmark / Unbookmark
router.post('/:id/bookmark', requireAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const allowed = await canReadBlog(req, blog);
        if (!allowed) return res.status(403).json({ message: 'Not allowed' });

        const userId = String(req.auth.sub);
        const bookmarkedBy = Array.isArray(blog.bookmarkedBy) ? blog.bookmarkedBy.map(String) : [];

        const isBookmarked = bookmarkedBy.includes(userId);
        if (isBookmarked) {
            blog.bookmarkedBy = blog.bookmarkedBy.filter((id) => String(id) !== userId);
        } else {
            blog.bookmarkedBy.push(userId);
        }

        await blog.save();
        return res.status(200).json({ blog: toBlogDto(blog, req.auth) });
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return res.status(500).json({ message: 'Error toggling bookmark' });
    }
});

// Comments
router.get('/:id/comments', optionalAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const allowed = await canReadBlog(req, blog);
        if (!allowed) return res.status(403).json({ message: 'Not allowed' });

        const comments = await Comment.find({ blogId: blog._id }).sort({ createdAt: 1 });
        return res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Error fetching comments' });
    }
});

router.post('/:id/comments', requireAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const allowed = await canReadBlog(req, blog);
        if (!allowed) return res.status(403).json({ message: 'Not allowed' });

        const { content } = req.body || {};
        if (!content || !String(content).trim()) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const comment = new Comment({
            blogId: blog._id,
            author: req.auth.username,
            authorId: req.auth.sub,
            content: String(content).trim(),
        });
        await comment.save();
        blog.commentCount = (blog.commentCount || 0) + 1;
        await blog.save();
        return res.status(201).json({ comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ message: 'Error adding comment' });
    }
});

router.delete('/:blogId/comments/:commentId', requireAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const userId = req.auth.sub;
        const username = req.auth.username;
        const isBlogOwner = (blog.authorId && String(blog.authorId) === String(userId)) ||
            (!blog.authorId && blog.author === username);

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (String(comment.blogId) !== String(blog._id)) {
            return res.status(400).json({ message: 'Comment does not belong to blog' });
        }

        const isCommentOwner = (comment.authorId && String(comment.authorId) === String(userId)) ||
            (!comment.authorId && comment.author === username);
        if (!isBlogOwner && !isCommentOwner) {
            return res.status(403).json({ message: 'Not allowed' });
        }

        await Comment.findByIdAndDelete(comment._id);
        blog.commentCount = Math.max(0, (blog.commentCount || 0) - 1);
        await blog.save();
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Error deleting comment' });
    }
});

module.exports = router;