import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaFolder, FaComment, FaTimes, FaRegHeart, FaRegBookmark } from 'react-icons/fa';
import '../Styles/BlogDetails.css';
import { apiFetch } from '../api';
import { UserContext } from '../UserContext';

const BlogDetail = ({ blog, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState(blog);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const [blogState, setBlogState] = useState(blog);

  useEffect(() => {
    setBlogState(blog);
    setEditedBlog(blog);
  }, [blog]);

  const fetchComments = useCallback(async () => {
    try {
      if (!blogState?._id) return;
      const response = await apiFetch(`/blogs/${blogState._id}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [blogState?._id]);

  // Fetch comments when the component mounts or when blog ID changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleToggleLike = async () => {
    try {
      const res = await apiFetch(`/blogs/${blogState._id}/like`, { method: 'POST' });
      if (!res.ok) return;
      const data = await res.json();
      setBlogState(data.blog);
      onUpdate(data.blog);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const res = await apiFetch(`/blogs/${blogState._id}/bookmark`, { method: 'POST' });
      if (!res.ok) return;
      const data = await res.json();
      setBlogState(data.blog);
      onUpdate(data.blog);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await apiFetch(`/blogs/${blog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedBlog.title,
          content: editedBlog.content,
          category: editedBlog.category,
          visibility: editedBlog.visibility,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(data.blog);
        setBlogState(data.blog);
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
      const response = await apiFetch(`/blogs/${blog._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
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
      const response = await apiFetch(`/blogs/${blog._id}/comments/${commentId}`, {
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
            <select
              value={editedBlog.visibility || 'public'}
              onChange={(e) => setEditedBlog({ ...editedBlog, visibility: e.target.value })}
              className="edit-input"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <div className="edit-actions">
              <button onClick={handleUpdate} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="blog-content">
            <h1>{blogState.title}</h1>
            <div className="blog-meta">
              <span><FaUser /> {blogState.author}</span>
              <span><FaClock /> {new Date(blogState.createdAt).toLocaleDateString()}</span>
              <span><FaFolder /> {blogState.category}</span>
              <span><FaComment /> {comments.length} Comments</span>
              {blogState.visibility === 'private' ? <span>Private</span> : <span>Public</span>}
            </div>
            <div className="blog-text">
              {blogState.content}
            </div>
            <div className="blog-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={handleToggleLike} className="edit-btn">
                <FaRegHeart /> {blogState.isLiked ? 'Liked' : 'Like'} ({blogState.likeCount || 0})
              </button>
              <button onClick={handleToggleBookmark} className="edit-btn">
                <FaRegBookmark /> {blogState.isBookmarked ? 'Saved' : 'Save'} ({blogState.bookmarkCount || 0})
              </button>
            </div>

            {blogState.isOwner ? (
              <div className="blog-actions">
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => onDelete(blogState._id)} className="delete-btn">
                  <FaTrash /> Delete
                </button>
              </div>
            ) : null}
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
            <button type="submit" disabled={loading}>
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
                {(user?.username === comment.author || user?.username === blog.author) && (
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
