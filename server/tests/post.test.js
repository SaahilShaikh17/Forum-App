const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../model/User');
const Post = require('../model/Post');
const app = require('../app');
const bcrypt = require('bcryptjs');

require('dotenv').config();

let createdUserId;
let refreshToken;
let accessToken;

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URI);

    // Creating a user for login tests
    const hashedPwd = await bcrypt.hash('Password12', 10);
    const user = await User.create({
        username: 'waffle',
        password: hashedPwd,
        firstname: 'John',
        lastname: 'Doe',
    });

    createdUserId = user._id;
},500000);

afterAll(async () => {
    // Clean up: Delete the test user and any test posts
    await User.findByIdAndDelete(createdUserId);
    await Post.deleteMany(); // Remove any posts created during tests
    await mongoose.connection.close();
});

describe('Post Creation', () => {
    beforeAll(async () => {
        // Log in the created user
        const response = await request(app).post('/login').send({
            user: 'waffle',
            pwd: 'Password12',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');

        accessToken = response.body.accessToken; // Save the access token
        refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1]; // Save refresh token
    },50000);

    it('should create a new post with valid data', async () => {
        const postResponse = await request(app)
            .post('/posts') // Adjust to your post creation endpoint
            .set('Authorization', `Bearer ${accessToken}`) // Set authorization header
            .send({
                title: 'Sample Post sample post',
                description: 'This is a sample post description.',
            });

        expect(postResponse.status).toBe(201);
        expect(postResponse.body.message).toBe("Post created successfully");
        expect(postResponse.body.post).toHaveProperty("_id");
        expect(postResponse.body.post.title).toBe("Sample Post sample post");
    });

    it('should not create a post without authentication', async () => {
    const postResponse = await request(app)
        .post('/posts') // Make sure this is the correct endpoint
        .send({
            title: 'Another Sample Post',
            description: 'This post should not be created without auth.',
        });

    expect(postResponse.status).toBe(401); // This should reflect unauthorized access
});
});
