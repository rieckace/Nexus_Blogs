import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Styles/IndexPage.css';
import { motion } from 'framer-motion';

const IndexPage = () => {
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
        {[...Array(50)].map((_, index) => (
          <div
            key={index}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
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
            <h1 className="title">Dive Into The Blog</h1>
            <p className="subtitle">Discover endless stories, ideas, and insights.</p>
            
            <motion.button
              className="explore-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="icon-container">
                <Sparkles className="sparkles-icon" />
              </span>
              <Link to="/login">
                <span className="button-text">Explore Now</span>
              </Link>
              <span className="shine-effect"></span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default IndexPage;