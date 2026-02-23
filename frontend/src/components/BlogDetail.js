import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaFolder, FaComment, FaTimes } from 'react-icons/fa';
import '../Styles/BlogDetails.css';

const BlogDetail = ({ blog, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState(blog);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch comments when the component mounts or when blog ID changes
  useEffect(() => {
    fetchComments();
  }, [blog._id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/${blog._id}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/blogs/${blog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedBlog),
      });

      if (response.ok) {
        onUpdate(editedBlog);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/blogs/${blog._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: localStorage.getItem('username') || 'Anonymous', // Get logged-in username
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`http://localhost:4000/comment/com${blog._id}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="blog-detail-overlay">
      <div className="blog-detail-container">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editedBlog.title}
              onChange={(e) => setEditedBlog({...editedBlog, title: e.target.value})}
              className="edit-input"
            />
            <textarea
              value={editedBlog.content}
              onChange={(e) => setEditedBlog({...editedBlog, content: e.target.value})}
              className="edit-textarea"
            />
            <input
              type="text"
              value={editedBlog.category}
              onChange={(e) => setEditedBlog({...editedBlog, category: e.target.value})}
              className="edit-input"
              placeholder="Category"
            />
            <div className="edit-actions">
              <button onClick={handleUpdate} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="blog-content">
            <h1>{blog.title}</h1>
            <div className="blog-meta">
              <span><FaUser /> {blog.author}</span>
              <span><FaClock /> {new Date(blog.createdAt).toLocaleDateString()}</span>
              <span><FaFolder /> {blog.category}</span>
              <span><FaComment /> {comments.length} Comments</span>
            </div>
            <div className="blog-text">
              {blog.content}
            </div>
            <div className="blog-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                <FaEdit /> Edit
              </button>
              <button onClick={() => onDelete(blog._id)} className="delete-btn">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        )}

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit" active={loading}>
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
                {(localStorage.getItem('username') === comment.author || 
                  localStorage.getItem('username') === blog.author) && (
                  <button 
                    onClick={() => handleDeleteComment(comment._id)}
                    className="delete-comment-btn"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
