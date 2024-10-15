import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './SinglePostView.css'; 

const SinglePostView = () => {
  const { postId } = useParams(); 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        // Fetch the post details
        const postResponse = await axios.get(`http://localhost:1337/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPost(postResponse.data.post);

        // Fetch the comments for the post
        const commentsResponse = await axios.get(`http://localhost:1337/comments/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setComments(commentsResponse.data.comments);
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      await axios.post(`http://localhost:1337/comments/post/${postId}`, {
        commentText: newComment
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Refetch the comments to update the UI
      const commentsResponse = await axios.get(`http://localhost:1337/comments/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setComments(commentsResponse.data.comments);
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="single-post-view">
      {post && (
        <div className="post-details">
          <h2 className="post-title">{post.title}</h2>
          <p className="post-description">{post.description}</p>
          {post.author && <p className="post-author">Author: {post.author.username}</p>}
          <p className="post-time">{new Date(post.time).toLocaleString()}</p>
        </div>
      )}

      <h3 className="comments-header">Comments</h3>
      <div className="comments-list">
        {Array.isArray(comments) && comments.map(comment => (
          <div key={comment._id} className="comment">
            <p className="comment-author">Author: {comment.author.username}</p> {/* Display comment author's name */}
            <p>{comment.comment}</p>
          </div>
        ))}
      </div>

      <div className="comment-input-container">
        <textarea
          className="comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button className="add-comment-btn" onClick={handleCommentSubmit}>Add Comment</button>
      </div>
    </div>
  );
};

export default SinglePostView;
