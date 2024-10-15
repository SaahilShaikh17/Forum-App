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
      await axios.post('http://localhost:1337/posts', {
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
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" required />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;