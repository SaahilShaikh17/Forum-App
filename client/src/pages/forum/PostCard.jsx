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
        <p className="post-description">{post.description}</p>
        <div className="post-footer">
          <p className="post-author">Author: {post.author.username}</p>
          <div className="post-stats">
            <button className="upvote-button">↑ {post.upvotes.length}</button>
            <p className="post-comments">Comments: {post.comments.length}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
