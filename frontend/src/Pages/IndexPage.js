import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Styles/IndexPage.css';
import { motion } from 'framer-motion';
import { apiFetch } from '../api';

const IndexPage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
      })),
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/blogs');
        if (!res.ok) return;
        const data = await res.json();
        const blogs = Array.isArray(data.blogs) ? data.blogs : [];
        if (!cancelled) setRecentPosts(blogs.slice(0, 3));
      } catch {
        // ignore (landing page should still look good offline)
      } finally {
        if (!cancelled) setIsLoadingPosts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-container">
      {/* Background elements */}
      <div className="background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="mesh-overlay"></div>

      {/* Animated particles */}
      <div className="stars-container">
        {stars.map((star, index) => (
          <div
            key={index}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="content-wrapper"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="content-container">
          <motion.div
            className="glass-card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div className="status-row">
              <span className="live-pill">
                <span className="live-dot" aria-hidden="true" /> Live
              </span>
              <span className="status-text">Updated {new Date().toLocaleDateString()}</span>
            </div>

            <h1 className="title">Dive Into The Blog</h1>
            <p className="subtitle">Discover stories, write your own, and save what matters.</p>

            <div className="feature-row" aria-label="Highlights">
              <span className="feature-pill">Public feed</span>
              <span className="feature-pill">Save posts</span>
              <span className="feature-pill">Create & publish</span>
            </div>

            <div className="cta-row">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link to="/login" className="explore-button">
                  <span className="icon-container" aria-hidden="true">
                    <Sparkles className="sparkles-icon" />
                  </span>
                  <span className="button-text">Explore Now</span>
                  <span className="shine-effect" aria-hidden="true"></span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link to="/register" className="secondary-button">
                  Create account
                </Link>
              </motion.div>
            </div>

            <div className="mini-feed" aria-label="Recent posts preview">
              <div className="mini-feed-header">
                <h2 className="mini-feed-title">Recent posts</h2>
                <Link to="/login" className="mini-feed-link">Sign in to read →</Link>
              </div>

              <div className="mini-feed-grid">
                {isLoadingPosts ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="mini-card skeleton" />
                  ))
                ) : recentPosts.length ? (
                  recentPosts.map((post) => (
                    <div key={post._id} className="mini-card">
                      <div className="mini-card-top">
                        <span className="mini-tag">{post.category || 'Blog'}</span>
                        <span className="mini-date">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="mini-title">{post.title || 'Untitled'}</div>
                      <div className="mini-excerpt">
                        {String(post.content || '').slice(0, 90)}
                        {String(post.content || '').length > 90 ? '…' : ''}
                      </div>
                      <div className="mini-author">by {post.author || 'Anonymous'}</div>
                    </div>
                  ))
                ) : (
                  <div className="mini-empty">No posts yet — be the first after you sign in.</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
};

export default IndexPage;