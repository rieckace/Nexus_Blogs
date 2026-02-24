import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import CreatePostPage from "./Pages/CreateBlogPage";
import Header from "./Header"; // Import Header
import IndexPage from "./Pages/IndexPage"; // Import IndexPage
import MyBlogPage from "./Pages/MyBlogPage";
import PublicFeedPage from "./Pages/PublicFeedPage";
import SavedBlogsPage from "./Pages/SavedBlogsPage";
import Subscribe from "./Pages/Subscribe"; // Import Subscribe page
import Contact from "./Pages/Contact"; // Import Contact page
import Profile from "./Pages/Profile"; // Import Profile page
import AboutPage from "./Pages/AboutPage";
import PrivacyPage from "./Pages/PrivacyPage";
import './App.css';

function RequireAuth({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} /> {/* Default entry point */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        {/* protected routes below */}
        
        {/* Header is only displayed after login */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <>
                <Header />
                <HomePage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/blog"
          element={
            <RequireAuth>
              <>
                <Header />
                <MyBlogPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/feed"
          element={
            <RequireAuth>
              <>
                <Header />
                <PublicFeedPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/saved"
          element={
            <RequireAuth>
              <>
                <Header />
                <SavedBlogsPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/create-blog"
          element={
            <RequireAuth>
              <>
                <Header />
                <CreatePostPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/subscribe"
          element={
            <RequireAuth>
              <>
                <Header />
                <Subscribe />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireAuth>
              <>
                <Header />
                <Contact />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth>
              <>
                <Header />
                <AboutPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/privacy"
          element={
            <RequireAuth>
              <>
                <Header />
                <PrivacyPage />
              </>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <>
                <Header />
                <Profile />
              </>
            </RequireAuth>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
