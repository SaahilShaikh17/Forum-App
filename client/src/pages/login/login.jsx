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
        const response = await axios.post('http://localhost:5000/login', { user, pwd });

        // Log the full response for debugging
        console.log('Login response:', response);

        if (response && response.data) {
            const { accessToken, userId } = response.data;

            // Store the accessToken and userId in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userId);

            // Redirect to the dashboard after successful login
            window.location.href = '/';
        } else {
            // If response.data is undefined, show an error
            setError('Login failed: No data received from server.');
        }
    } catch (error) {
        console.error('Login failed:', error);

        // Check if error.response exists and log it for debugging
        if (error.response && error.response.data) {
            setError(error.response.data.message || 'Invalid username or password');
        } else {
            setError('Login failed: No response from server.');
        }
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
