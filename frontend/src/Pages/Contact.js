import React, { useState } from 'react';
import '../Styles/Contact.css';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/con/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const result = await response.json();
            if(response.ok){
                setStatus("Message sent successfully.");
            }
        } catch (error) {
            setStatus('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="message">Message:</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Send Message</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default Contact;
