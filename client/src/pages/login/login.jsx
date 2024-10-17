import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { Link } from 'react-router-dom';

export const LoginScreen = () => {
  const [user, setUsername] = useState('');
  const [pwd, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:1337/login', { user, pwd });

      // Handle successful login
      const { accessToken, userId } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', userId);
      window.location.href = '/'; // Redirect to the dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-header">Welcome Back!</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={user}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={pwd}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">Log In</button>
        </form>
        <p className="register-prompt">Don't have an account? <Link to="/register" className="register-link">Register Here</Link></p>
      </div>
    </div>
  );
};
