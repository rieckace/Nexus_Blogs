import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaFolder, FaRegHeart, FaRegBookmark, FaComment } from 'react-icons/fa';
import BlogDetail from '../components/BlogDetail';
import '../Styles/MyBlogPage.css';
import { apiFetch } from '../api';

const SavedBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/blogs/bookmarks');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching saved blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseBlogDetail = () => {
    setSelectedBlog(null);
  };

  const handleUpdateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog._id === updatedBlog._id ? updatedBlog : blog));
    setSelectedBlog(updatedBlog);
  };

  const handleUnsave = async (blogId) => {
    try {
      const res = await apiFetch(`/blogs/${blogId}/bookmark`, { method: 'POST' });
      if (!res.ok) return;
      setBlogs(blogs.filter(b => b._id !== blogId));
      if (selectedBlog?._id === blogId) setSelectedBlog(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading saved posts...</p>
      </div>
    );
  }

  return (
    <div className="myblog-page">
      <div className="blog-header">
        <h1>Saved Posts</h1>
      </div>

      <div className="blog-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card" onClick={() => handleBlogClick(blog)}>
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p className="blog-text">{String(blog.content || '').substring(0, 150)}...</p>
                <div className="blog-meta">
                  <span><FaUser /> {blog.author}</span>
                  <span><FaClock /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span><FaFolder /> {blog.category}</span>
                  <span><FaRegHeart /> {blog.likeCount || 0}</span>
                  <span><FaComment /> {blog.commentCount || 0}</span>
                  <span><FaRegBookmark /> {blog.bookmarkCount || 0}</span>
                </div>

                <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleUnsave(blog._id); }}
                    className="edit-btn"
                    style={{ padding: '8px 10px' }}
                  >
                    <FaRegBookmark /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-blogs">
            <h3>No saved posts yet</h3>
            <p>Go to Public Feed and save posts you like.</p>
          </div>
        )}
      </div>

      {selectedBlog && (
        <BlogDetail
          blog={selectedBlog}
          onClose={handleCloseBlogDetail}
          onUpdate={handleUpdateBlog}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};

export default SavedBlogsPage;
