import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import '../Styles/LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:4000/auth/login", { // Corrected URL
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUser(userInfo);
        setSuccessMessage("Welcome back! Redirecting to your dashboard...");
        setRedirect(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Username or password is incorrect. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("Login failed. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-page">
      <div className="animated-background">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="login-container">
        <div className="login-content">
          <div className="brand-section">
            <h1 className="brand-title">Welcome Back</h1>
            <p className="brand-subtitle">Enter your credentials to access your account</p>
          </div>

          <form className="login-form" onSubmit={login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                />
              </div>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" className="login-button">
              Sign In
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

          </form>

          <p className="register-text">
            First time here? Sign up.{" "}
            <Link to="/register" className="register-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
