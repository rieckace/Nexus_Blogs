import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css'; // Import your CSS file
import '../Styles/RegistrationPage.css'

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:4000/auth/register', { // Corrected URL
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setSuccessMessage('Registration successful');
        setTimeout(() => {
          navigate('/login'); // Navigate to the login page after 2 seconds
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Registration failed');
    }
  }

  return (
    <div className="register-container" >
      <form className="register" onSubmit={register}>
        <h1>Register Here</h1>
        <input type="text"
               placeholder="Enter username"
               value={username}
               onChange={ev => setUsername(ev.target.value)} />
        <input type="password"
               placeholder="Enter password"
               value={password}
               onChange={ev => setPassword(ev.target.value)} />
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button>Register</button>
      </form>
    </div>
  );
}
