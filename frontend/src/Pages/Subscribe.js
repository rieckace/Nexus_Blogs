import React, { useState } from 'react';
import '../Styles/Subscribe.css';
import { Link } from 'react-router-dom';

const Subscribe = () => {
    const [email, setEmail] = useState('');
    const [status , setStatus] = useState('');
    // const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/subscribe/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            if(response.ok){
                setStatus("Subscribed successfully.");
            }
        } catch (error) {
            setStatus('Failed to subscribe!!!');
        }
    };
    return (
      <div>
        <div className='sub-main'>
          <div className="subscribe-container">
            <h1>Subscribe to our Blog</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Subscribe</button>
            </form>
            {status && <p>{status}</p>}
          </div>
        </div>

        {/* Footer Section */}
        <footer className="footer-section" style={{width:"100vw"}}> 
          <div className="footer-content">
            <marquee behavior="scroll" direction="left" className="marquee-text">
              Thank you for visiting Nexus. Stay tuned for more updates and articles!
            </marquee>
            <p className="footer-text">
              &copy; 2025 Nexus. All rights reserved.
            </p>
            <div className="footer-links">
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </div>
    );
};

export default Subscribe;
