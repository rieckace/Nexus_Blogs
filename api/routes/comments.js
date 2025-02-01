// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose.connect('mongodb://127.0.0.1:27017/Main_Blog', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const commentSchema = new mongoose.Schema({
//   blogId: mongoose.Schema.Types.ObjectId,
//   author: String,
//   content: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Comment = mongoose.model('Comment', commentSchema);

// // Fetch comments for a blog
// app.get('/com/:blogId/comments', async (req, res) => {
//   try {
//     const comments = await Comment.find({ blogId: req.params.blogId });
//     res.json({ comments });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch comments' });
//   }
// });

// // Add a comment
// app.post('/com/:blogId/comments', async (req, res) => {
//   try {
//     const { author, content } = req.body;
//     const newComment = new Comment({
//       blogId: req.params.blogId,
//       author,
//       content,
//     });
//     await newComment.save();
//     res.status(201).json({ comment: newComment });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add comment' });
//   }
// });

// // Delete a comment
// app.delete('/com/:blogId/comments/:commentId', async (req, res) => {
//   try {
//     await Comment.findByIdAndDelete(req.params.commentId);
//     res.json({ message: 'Comment deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete comment' });
//   }
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
