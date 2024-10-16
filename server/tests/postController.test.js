const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust path
const express = require('express');
const Post = require('../model/Post');
const User = require('../model/User');

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Post Controller', () => {
  let token;
  let postId;
  let userId;

  beforeAll(async () => {
    const user = await User.create({ firstname:'Saahil' , lastname: 'Shaikh', username: 'testuser1', password: 'password123' });
    userId = user._id;

    // Generate JWT Token using username (or any other payload)
    const generateAccessToken = (username) => {
        return jwt.sign(
            { username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
    };
    
    const generateRefreshToken = (username) => {
        return jwt.sign(
            { username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
    };

    const post = await Post.create({ title: 'Test Post feinfeinfeinfeinfeinfeinfeinfeinfein', description: 'Test Description', author: userId });
    postId = post._id;
  });

//   afterAll(async () => {
//     await User.deleteMany({});
//     await Post.deleteMany({});
//   });

  it('should create a post', async () => {
    const response = await request(app)
      .post('/posts/')
      .send({ title: 'New Post', description: 'New Description' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Post created successfully');
    expect(response.body.post).toHaveProperty('_id');
  });

  it('should update a post', async () => {
    const response = await request(app)
      .patch(`/posts/${postId}`)
      .send({ title: 'Updated Title' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.post.title).toBe('Updated Title');
  });

  it('should delete a post', async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted successfully');
  });

  it('should get all posts', async () => {
    const response = await request(app).get('/posts');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get post by ID', async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.status).toBe(200);
    expect(response.body.post._id).toBe(postId.toString());
  });
});
