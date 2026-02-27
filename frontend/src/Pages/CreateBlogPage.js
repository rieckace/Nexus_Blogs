import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaTimes } from 'react-icons/fa';
import '../Styles/CreateBlogPage.css';
import { apiFetch } from '../api';

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Predefined categories
  const categories = [
    'Technology', 'Lifestyle', 'Travel', 
    'Food', 'Health', 'Business', 
    'Education', 'Entertainment', 'Other'
  ];

  const isOtherCategory = category === 'Other';

  const resolveCategory = () => {
    if (!isOtherCategory) return category;
    return customCategory.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalCategory = resolveCategory();

    if (!title || !content || !category) {
      alert('Please fill all the required fields');
      setIsSubmitting(false);
      return;
    }

    if (isOtherCategory && !finalCategory) {
      alert('Please enter your category');
      setIsSubmitting(false);
      return;
    }

    const blogData = {
      title,
      content,
      category: finalCategory,
      externalLink,
      visibility,
    };

    try {
      const response = await apiFetch('/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      if (response.status === 200) {
        alert(data.message);
        navigate('/blog');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('There was an error creating your blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setCustomCategory('');
    setExternalLink('');
    setVisibility('public');
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-header">
        <button 
          className="back-button"
          onClick={() => navigate('/blog')}
        >
          <FaArrowLeft /> Back to My Blogs
        </button>
        <h1>Create New Blog Post</h1>
      </div>

      <div className="create-blog-content">
        <form onSubmit={handleSubmit} className="create-blog-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Visibility <span className="required">*</span></label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                required
                className="form-input"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select
                value={category}
                onChange={(e) => {
                  const next = e.target.value;
                  setCategory(next);
                  if (next !== 'Other') setCustomCategory('');
                }}
                required
                className="form-input"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {isOtherCategory ? (
              <div className="form-group">
                <label>Other Category <span className="required">*</span></label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Type your category"
                  required
                  className="form-input"
                />
              </div>
            ) : null}

            <div className="form-group">
              <label>External Link</label>
              <input
                type="text"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="Add a relevant link (optional)"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Content <span className="required">*</span></label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              required
              className="form-textarea"
              rows="10"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="clear-button"
              onClick={clearForm}
            >
              <FaTimes /> Clear Form
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              <FaPaperPlane /> {isSubmitting ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;