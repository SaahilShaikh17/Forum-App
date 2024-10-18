import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = ({ history }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post('http://backend-service:5000/posts', {
        title,
        description
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // Reset form fields
      setTitle('');
      setDescription('');
      history.push('/forum');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-post-container">
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="postTitle">Post Title:</label>
          <input 
            type="text" 
            id="postTitle" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="postContent">Post Content:</label>
          <textarea 
            id="postContent" 
            rows="5" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
