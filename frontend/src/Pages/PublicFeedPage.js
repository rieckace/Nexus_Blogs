import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaFolder, FaSearch, FaTimes, FaRegHeart, FaRegBookmark, FaComment } from 'react-icons/fa';
import BlogDetail from '../components/BlogDetail';
import '../Styles/MyBlogPage.css';
import { apiFetch } from '../api';

const PublicFeedPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/blogs');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching public blogs:', error);
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

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchBlogs();
      return;
    }
    try {
      setLoading(true);
      const response = await apiFetch(`/blogs/search?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // search includes your private too (backend). Filter to public here to keep feed consistent.
      setBlogs((data.blogs || []).filter(b => b.visibility !== 'private'));
    } catch (error) {
      console.error('Error searching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggleLike = async (blogId) => {
    try {
      const res = await apiFetch(`/blogs/${blogId}/like`, { method: 'POST' });
      if (!res.ok) return;
      const data = await res.json();
      handleUpdateBlog(data.blog);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = async (blogId) => {
    try {
      const res = await apiFetch(`/blogs/${blogId}/bookmark`, { method: 'POST' });
      if (!res.ok) return;
      const data = await res.json();
      handleUpdateBlog(data.blog);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesFilter = filter === 'all' || blog.category === filter;
    return matchesFilter;
  });

  const categories = [...new Set(blogs.map(blog => blog.category))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading public feed...</p>
      </div>
    );
  }

  return (
    <div className="myblog-page">
      <div className="blog-header">
        <h1>Public Feed</h1>
        <div className="blog-controls">
          <input
            type="text"
            placeholder="Search public blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button className="search-toggle" onClick={handleSearch}>
            {searchTerm ? <FaTimes /> : <FaSearch />}
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="blog-grid">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
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
                    onClick={(e) => { e.stopPropagation(); handleToggleLike(blog._id); }}
                    className="edit-btn"
                    style={{ padding: '8px 10px' }}
                  >
                    <FaRegHeart /> {blog.isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleToggleBookmark(blog._id); }}
                    className="edit-btn"
                    style={{ padding: '8px 10px' }}
                  >
                    <FaRegBookmark /> {blog.isBookmarked ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-blogs">
            <h3>No public blogs found</h3>
            <p>Try searching for something else.</p>
          </div>
        )}
      </div>

      {selectedBlog && (
        <BlogDetail
          blog={selectedBlog}
          onClose={handleCloseBlogDetail}
          onUpdate={handleUpdateBlog}
          onDelete={() => { /* public feed doesn't support delete */ }}
        />
      )}
    </div>
  );
};

export default PublicFeedPage;
