import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaTimes, FaUser } from 'react-icons/fa';
import './Styles/Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">Nexus</span>
          <span className="logo-dot">.</span>
        </Link>

        <nav className="nav-links">
          {/* <Link to="/home" className={location.pathname === '/' ? 'active' : ''}>
            Nexus
          </Link> */}
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>
            My Blog
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
