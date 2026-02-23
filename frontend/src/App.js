import React from "react";
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
                <MyBlogPage />
              </>
            }
          />
          <Route
            path="/create-blog"
            element={
              <>
                <Header />
                <CreatePostPage />
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
