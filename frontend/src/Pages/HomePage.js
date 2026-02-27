import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaRegClock, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import '../Styles/HomePage.css';
import photo from '../assets/photo.avif';
import aa2 from '../assets/aa2.jpeg';
import writing from '../assets/writing.avif';
import { apiFetch } from '../api';
import Footer from '../components/Footer';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [publicPosts, setPublicPosts] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    (async () => {
      try {
        const res = await apiFetch('/blogs');
        if (res.ok) {
          const data = await res.json();
          setPublicPosts(Array.isArray(data.blogs) ? data.blogs.slice(0, 6) : []);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Sample featured posts data
  const featuredPosts = [
    {
      id: 1,
      title: "The Future of Web Development",
      category: "Technology",
      image: aa2, // Use imported image
      author: "Rikesh Yadav",
      date: "2 hours ago",
      likes: 234,
      comments: 56,
      excerpt: "Exploring the latest trends in web development and what's coming next..."
    },
    {
      id: 2,
      title: "Mastering Creative Writing",
      category: "Writing",
      image: writing, // Use imported image
      author: "Smritee Hamal",
      date: "5 hours ago",
      likes: 189,
      comments: 43,
      excerpt: "Essential tips and techniques to improve your creative writing skills..."
    },
    {
      id: 3,
      title: "Digital Photography Basics",
      category: "Photography",
      image: photo, // Use imported image
      author: "Sonam Tamang",
      date: "1 day ago",
      likes: 156,
      comments: 28,
      excerpt: "A beginner's guide to understanding digital photography fundamentals..."
    }
  ];

  return (
    <div className={`home-page ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome To <span className="highlight">Nexus</span>.
          </h1>
          <p className="hero-subtitle">
            Discover our blog posts and stay updated.
          </p>
          <div className="hero-cta-row">
            <Link to="/blog" className="cta-button">
              Start Reading <FaArrowRight className="arrow-icon" />
            </Link>
            <Link to="/feed" className="cta-button secondary">
              Public Feed <FaArrowRight className="arrow-icon" />
            </Link>
          </div>
        </div>
        {/* <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Articles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Readers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1K+</span>
            <span className="stat-label">Writers</span>
          </div>
        </div> */}
      </section>

      {/* Featured Posts Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Articles</h2>
        <div className="featured-grid">
          {featuredPosts.map((post) => (
            <article key={post.id} className="featured-card">
              <div className="card-image">
                <img src={post.image} alt={post.title} />
                <span className="category-tag">{post.category}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{post.title}</h3>
                <p className="card-excerpt">{post.excerpt}</p>
                <div className="card-meta">
                  <div className="meta-left">
                    <span className="author">{post.author}</span>
                    <span className="date">
                      <FaRegClock className="meta-icon" /> {post.date}
                    </span>
                  </div>
                  <div className="meta-right">
                    <span className="likes">
                      <FaRegHeart className="meta-icon" /> {post.likes}
                    </span>
                    <span className="comments">
                      <FaRegComment className="meta-icon" /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recent Public Posts */}
      {publicPosts.length ? (
        <section className="featured-section">
          <h2 className="section-title">Recent Public Posts</h2>
          <div className="featured-grid">
            {publicPosts.map((post) => (
              <article key={post._id} className="featured-card">
                <div className="card-content">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-excerpt">{String(post.content || '').substring(0, 140)}...</p>
                  <div className="card-meta">
                    <div className="meta-left">
                      <span className="author">{post.author}</span>
                      <span className="date">
                        <FaRegClock className="meta-icon" /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-right">
                      <span className="likes">{post.category}</span>
                      <span className="comments">Public</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Topics Section */}
      <section className="topics-section">
        <h2 className="section-title">Popular Topics</h2>

        <div className="topics-grid">
          <a href="https://indianexpress.com/section/technology/" className="topic-card">
            <h3>Technology</h3>
            <FaArrowRight className="topic-arrow" />
          </a>
          <a href="https://www.thehindu.com/tag/449-447-428/" className="topic-card">
            <h3>Writing</h3>
            <FaArrowRight className="topic-arrow" />
          </a>
          <a href="https://photography.com/" className="topic-card">
            <h3>Photography</h3>
            <FaArrowRight className="topic-arrow" />
          </a>
          <a href="https://www.cardekho.com/latestcars" className="topic-card">
            <h3>Design</h3>
            <FaArrowRight className="topic-arrow" />
          </a>
          <a href="https://www.businesstoday.in/" className="topic-card">
            <h3>Business</h3>
            <FaArrowRight className="topic-arrow" />
          </a>
          <a href="https://cupofjo.com/category/style/" className="topic-card">
            <h3>Lifestyle</h3>
            <FaArrowRight className="topic-arrow" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
