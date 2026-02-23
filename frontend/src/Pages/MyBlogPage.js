import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaFolder, FaSearch, FaTimes, FaComment } from 'react-icons/fa';
import BlogDetail from '../components/BlogDetail';
import '../Styles/MyBlogPage.css';

const MyBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/blogs/');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`http://localhost:4000/blogs/${blogId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setBlogs(blogs.filter(blog => blog._id !== blogId));
          setSelectedBlog(null);
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchBlogs();
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/blogs/search?query=${searchTerm}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBlogs(data.blogs);
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

  const filteredBlogs = blogs.filter(blog => {
    const matchesFilter = filter === 'all' || blog.category === filter;
    return matchesFilter;
  });

  const categories = [...new Set(blogs.map(blog => blog.category))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your blogs...</p>
      </div>
    );
  }

  return (
    <div className="myblog-page">
      <div className="blog-header">
        <h1>My Blog Posts</h1>
        <div className="blog-controls">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button className="search-toggle" onClick={handleSearch}>
            {searchOpen ? <FaTimes /> : <FaSearch />}
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
                <p className="blog-text">{blog.content.substring(0, 150)}...</p>
                <div className="blog-meta">
                  <span><FaUser /> {blog.author}</span>
                  <span><FaClock /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span><FaFolder /> {blog.category}</span>
                  <span><FaComment /> {blog.commentCount || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-blogs">
            <h3>No blogs found</h3>
            <p>Start creating your first blog post!</p>
          </div>
        )}
      </div>
      {selectedBlog && (
        <BlogDetail
          blog={selectedBlog}
          onClose={handleCloseBlogDetail}
          onUpdate={handleUpdateBlog}
          onDelete={handleDeleteBlog}
        />
      )}
    </div>
  );
};

export default MyBlogPage;
