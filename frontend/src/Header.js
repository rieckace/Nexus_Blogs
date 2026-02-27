import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './Styles/Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close the mobile menu after navigation
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <Link to="/home" className="logo">
          <span className="logo-text">Nexus</span>
          <span className="logo-dot">.</span>
        </Link>

        <nav
          id="primary-navigation"
          className={`nav-links ${menuOpen ? 'is-open' : ''}`}
          aria-label="Primary"
        >
          {/* <Link to="/home" className={location.pathname === '/' ? 'active' : ''}>
            Nexus
          </Link> */}
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/feed" className={location.pathname === '/feed' ? 'active' : ''}>
            Public Feed
          </Link>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>
            My Posts
          </Link>
          <Link to="/saved" className={location.pathname === '/saved' ? 'active' : ''}>
            Saved
          </Link>
          <Link to="/create-blog" className={location.pathname === '/create-blog' ? 'active' : ''}>
            Create Post
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            Contact
          </Link>
          <Link to="/subscribe" className="subscribe-link">
            Subscribe
          </Link>

           <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            <FaUser className="profile-icon" /> Profile
          </Link> 
        </nav>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
        </button>

        {/* <div className={`search-container ${searchOpen ? 'open' : ''}`}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search posts..."
          />

          <button 
            className="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? <FaTimes /> : <FaSearch />}
          </button>

        </div>  */}
      </div>
    </header>
  );
}
