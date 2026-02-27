import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <p className="app-footer__headline">
          Thank you for visiting Nexus. Stay tuned for more updates and articles!
        </p>
        <p className="app-footer__copyright">© 2025 Nexus. All rights reserved.</p>
        <nav className="app-footer__links" aria-label="Footer">
          <Link to="/about" className="app-footer__link">About Us</Link>
          <Link to="/contact" className="app-footer__link">Contact</Link>
          <Link to="/privacy" className="app-footer__link">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
