import React, { useState } from 'react';
import '../Styles/Subscribe.css';
import { apiFetch } from '../api';
import Footer from '../components/Footer';

const Subscribe = () => {
    const [email, setEmail] = useState('');
    const [status , setStatus] = useState('');
    // const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
        const response = await apiFetch('/subscribe/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
        const result = await response.json().catch(() => ({}));
        if (response.ok) {
          setStatus(result.message || 'Subscribed successfully.');
        } else {
          setStatus(result.message || 'Failed to subscribe!!!');
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

        <Footer />
      </div>
    );
};

export default Subscribe;
