const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const app = require('../app');
const bcrypt = require('bcrypt');

require('dotenv').config();

let createdUserId, createdPostId, accessToken;

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URI);

    // Creating a user for the tests
    const hashedPwd = await bcrypt.hash('Password12', 10);
    const user = await User.create({
        username: 'testuser',
        password: hashedPwd,
        firstname: 'John',
        lastname: 'Doe',
    });

    createdUserId = user._id;

    // Log in the user to get the access token
    const loginResponse = await request(app).post('/login').send({
        user: 'testuser',
        pwd: 'Password12',
    });

    expect(loginResponse.status).toBe(200);
    accessToken = loginResponse.body.accessToken;

    const postResponse = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            title: 'Sample Post',
            description: 'This is a sample post description.',
        });

    expect(postResponse.status).toBe(201);
    createdPostId = postResponse.body.post._id;
}, 500000);

afterAll(async () => {
    await User.findByIdAndDelete(createdUserId);
    await Post.findByIdAndDelete(createdPostId);
    await Comment.deleteMany(); // Clean up any comments created during tests
    await mongoose.connection.close();
});

describe('Comment Creation', () => {
    it('should create a comment on a valid post', async () => {
        const response = await request(app)
            .post(`/comments/post/${createdPostId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                commentText: 'This is a valid comment.',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Comment created successfully');
        expect(response.body.comment).toHaveProperty('_id');
        expect(response.body.comment.comment).toBe('This is a valid comment.');
    });

    // it('should not create a comment without text', async () => {
    //     const response = await request(app)
    //         .post(`/comments/post/${createdPostId}`)
    //         .set('Authorization', `Bearer ${accessToken}`)
    //         .send({});

    //     expect(response.status).toBe(400);
    //     expect(response.body.message).toBe('Enter your comment!');
    // });

    it('should not create a comment on a non-existent post', async () => {
        const fakePostId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post(`/comments/post/${fakePostId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                commentText: 'This comment should fail.',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Post not found');
    });

    it('should not create a comment if user is not logged in', async () => {
        const response = await request(app)
            .post(`/comments/post/${createdPostId}`)
            .send({
                commentText: 'This comment should fail.',
            });

        expect(response.status).toBe(401); // Unauthorized
    });
});
