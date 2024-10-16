import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css'; 

const PostCard = ({ post }) => {
  return (
    <Link to={`/posts/${post._id}`} className="post-card-link">
      <div className="post-card">
        <div className="post-header">
          <span className="post-time">{new Date(post.time).toLocaleString()}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <div className="post-footer">
          {/* Safely access author and username */}
          <p className="post-author">Author: {post.author?.username || '[deleted]'}</p>
          <div className="post-stats">
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
