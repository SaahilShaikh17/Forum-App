import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import PostCard from './PostCard';
import './forum.css';

export const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://20.247.172.63:5000/posts', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchPosts();
    } else {
      setLoading(false); // Set loading to false if not logged in
    }
  }, [accessToken]);

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1>Forum</h1>
      </div>
      {accessToken ? (
        <div>
          <div className="button-container">
            <Link to="/create-post">
              <button className="action-button">Create Post</button>
            </Link>
            <Link to="/profile">
              <button className="action-button">Update Profile</button>
            </Link>
          </div>
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <div className="post-cards-container">
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <p>No posts available.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="login-prompt">
  <h2 className="login-heading">Welcome to the Forum!</h2>
  <p className="login-text">Please log in to view and participate in discussions.</p>
  <Link to="/login">
    <button className="login-button">Log In</button>
  </Link>
  <p className="login-text last-text">Don't have an account? <Link to="/register" className="link signup-link">Sign up here!</Link></p>
</div>

      )}
    </div>
  );
};
