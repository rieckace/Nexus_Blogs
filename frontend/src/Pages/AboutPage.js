import React from 'react';
import '../Styles/PrivacyPage.css';

export default function AboutPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-card">
        <div className="privacy-header">
          <h1>About Nexus</h1>
          <p>A simple, modern blogging platform.</p>
        </div>

        <div className="privacy-content">
          <p>
            Nexus is a blog platform where readers can explore public posts, and writers can create
            public or private posts.
          </p>
          <p>
            This project includes authentication, profile management, likes, comments, and saved posts.
          </p>
        </div>
      </div>
    </div>
  );
}
