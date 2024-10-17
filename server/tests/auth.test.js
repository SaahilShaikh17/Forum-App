const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../model/User');
const app = require('../app');
const bcrypt = require('bcryptjs');

require('dotenv').config();

let createdUserId;
let refreshToken;

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URI);

    //Creating a user for login tests
    const hashedPwd = await bcrypt.hash('Password12',10);
    const user = await User.create({
        username: 'jane_doe',
        password: hashedPwd,
        firstname:'Jane',
        lastname: 'Doe',
    });

    createdUserId = user._id;
},50000);

afterAll(async () => {
    // Clean up: Delete the test user
    await User.findByIdAndDelete(createdUserId);
    await mongoose.connection.close();
  });

describe('User Login', ()=>{
    it('should log in with correct credentials', async()=>{
        const response = await request(app).post('/login').send({
            user:'jane_doe',
            pwd:'Password12',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');

        refreshToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
        expect(refreshToken).not.toBeUndefined();
    });

    it('should not log in with incorrect password', async () => {
        const response = await request(app).post('/login').send({
          user: 'jane_doe',
          pwd: 'WrongPassword',
        });
    
        expect(response.status).toBe(401);
      });

      it('should not log in with missing credentials', async () => {
        const response = await request(app).post('/login').send({
          user: 'jane_doe',
        });
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username and Password are Neecessary!');
      });

      
});

describe('Authentication and Token Handling', () => {
    it('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .get('/refresh')
        .set('Cookie', [`jwt=${refreshToken}`]);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });
  
    it('should not refresh token with invalid token', async () => {
      const response = await request(app)
        .get('/refresh')
        .set('Cookie', ['jwt=InvalidToken']);
  
      expect(response.status).toBe(403);
    });
  
    it('should log out and invalidate the refresh token', async () => {
      const response = await request(app)
        .get('/logout')
        .set('Cookie', [`jwt=${refreshToken}`]);
  
      expect(response.status).toBe(204); // No Content
  
      const refreshedResponse = await request(app)
        .get('/refresh')
        .set('Cookie', [`jwt=${refreshToken}`]);
  
      expect(refreshedResponse.status).toBe(403); // Token should be invalid now
    });
  
    it('should handle logout without a token gracefully', async () => {
      const response = await request(app).get('/logout');
      expect(response.status).toBe(204); // No Content
    });
  });


