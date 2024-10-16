const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust path to your server.js
const express = require('express');
const Comment = require('../model/Comment');
const User = require('../model/User');
const Post = require('../model/Post');

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Comment Controller', () => {
  let token;
  let postId;
  let userId;

  beforeAll(async () => {
    const user = await User.create({ firstname:'Sachit', lastname:'Desai' ,username: 'testuser', password: 'password123' });
    userId = user._id;

    const post = await Post.create({ title: 'Test Post fein feinfeinfeinfeinfein', description: 'Description', author: user._id });
    postId = post._id;

    const jwt = require('jsonwebtoken');

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
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
  });

  it('should create a comment', async () => {
    const response = await request(app)
      .post(`/comments/post/${postId}`)
      .send({ commentText: 'Nice post!' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Comment created successfully');
    expect(response.body.comment).toHaveProperty('_id');
  });

  it('should update a comment', async () => {
    const comment = await Comment.create({ post: postId, comment: 'Nice post!', author: userId });

    const response = await request(app)
      .patch(`/comment/${comment._id}`)
      .send({ commentText: 'Updated comment' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.comment).toBe('Updated comment');
  });

  it('should delete a comment', async () => {
    const comment = await Comment.create({ post: postId, comment: 'Nice post!', author: userId });

    const response = await request(app)
      .delete(`/comment/${comment._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Comment deleted successfully');
  });

  it('should get comments for a post', async () => {
    await Comment.create({ post: postId, comment: 'First Comment', author: userId });

    const response = await request(app).get(`/comments/post/${postId}`);
    expect(response.status).toBe(200);
    expect(response.body.comments.length).toBeGreaterThan(0);
  });
});
