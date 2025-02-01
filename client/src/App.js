import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import CreatePostPage from "./Pages/CreateBlogPage";
import Header from "./Header"; // Import Header
import IndexPage from "./Pages/IndexPage"; // Import IndexPage
import MyBlogPage from "./Pages/MyBlogPage";
import Subscribe from "./Pages/Subscribe"; // Import Subscribe page
import Contact from "./Pages/Contact"; // Import Contact page
import Profile from "./Pages/Profile"; // Import Profile page
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} /> {/* Default entry point */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/create-blog" element={<CreatePostPage />} />
          
          {/* Header is only displayed after login */}
          <Route
            path="/home"
            element={
              <>
                <Header />
                <HomePage />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Header />
                <MyBlogPage posts={posts} setPosts={setPosts} />
              </>
            }
          />
          <Route
            path="/create-blog"
            element={
              <>
                <Header />
                <CreatePostPage setPosts={setPosts} />
              </>
            }
          />
          <Route
            path="/subscribe"
            element={
              <>
                <Header />
                <Subscribe />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
              <Header />
                <Contact />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <Profile />
              </>
            }
          />
          
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
