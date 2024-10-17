import "./navbar.css";
import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const isLoggedIn = localStorage.getItem('accessToken'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">Pipeline of Doom</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavDropdown" 
          aria-controls="navbarNavDropdown" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <div className="nav-actions">
            {isLoggedIn ? (
              <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login" className="btn btn-login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
