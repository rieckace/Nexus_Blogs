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
import ApiWarmupOverlay from "./components/ApiWarmupOverlay";
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

function AuthedLayout({ children }) {
  return (
    <>
      <Header />
      <main className="app-page">{children}</main>
    </>
  );
}

function App() {
  return (
    <Router>
      <ApiWarmupOverlay />
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
              <AuthedLayout>
                <HomePage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/blog"
          element={
            <RequireAuth>
              <AuthedLayout>
                <MyBlogPage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/feed"
          element={
            <RequireAuth>
              <AuthedLayout>
                <PublicFeedPage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/saved"
          element={
            <RequireAuth>
              <AuthedLayout>
                <SavedBlogsPage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/create-blog"
          element={
            <RequireAuth>
              <AuthedLayout>
                <CreatePostPage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/subscribe"
          element={
            <RequireAuth>
              <AuthedLayout>
                <Subscribe />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireAuth>
              <AuthedLayout>
                <Contact />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth>
              <AuthedLayout>
                <AboutPage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/privacy"
          element={
            <RequireAuth>
              <AuthedLayout>
                <PrivacyPage />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <AuthedLayout>
                <Profile />
              </AuthedLayout>
            </RequireAuth>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
