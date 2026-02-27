import React from 'react';
import '../Styles/PrivacyPage.css';

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-card">
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>
            Transparent, simple, and respectful of your data.
          </p>
        </div>

        <div className="privacy-content">
          <h2>Demo Notice</h2>
          <p>This is a demo application. Do not upload sensitive personal information.</p>

          <h2>What We Store</h2>
          <ul>
            <li>Account details you provide (e.g., username).</li>
            <li>Blog content you create (title, content, category, visibility).</li>
            <li>Profile photo (if you upload one).</li>
          </ul>

          <h2>How It’s Used</h2>
          <p>
            We use your data only to run core features: authentication, creating posts, commenting,
            saving posts, and showing your profile.
          </p>

          <h2>Data Location</h2>
          <p>
            Profile photos and content are stored in the connected MongoDB database and served by the backend API.
          </p>
        </div>
      </div>
    </div>
  );
}
