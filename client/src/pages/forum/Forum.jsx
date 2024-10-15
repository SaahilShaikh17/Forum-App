import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import PostCard from './PostCard';
import './forum.css';

export const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:1337/posts', {
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

    fetchPosts();
  }, []);

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1>Forum</h1>
      </div>
      <div className="button-container">
        <Link to="/create-post">
          <button className="action-button">Create Post</button>
        </Link>
        <button className="action-button" onClick={handleLogout}>Logout</button>
        <Link to="/profile">
          <button className="action-button">Update Profile</button>
        </Link>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="post-cards-container">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
