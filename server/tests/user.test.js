const mongoose = require("mongoose");
const request = require("supertest");
const User = require('../model/User');
const app = require("../app");

require("dotenv").config();

beforeEach(async () =>{
  await mongoose.connect(process.env.DATABASE_URI);
});

afterEach(async() =>{
  await mongoose.connection.close();
});

describe('User Creation', ()=>{
  //1. Test creating a new user with valid data
  it('should create a new user with valid data', async() => {
    const response = await request(app).post('/register').send({
      user:'john_doe',
      pwd:'Password123',
      fname:'John',
      lname:'Doe',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Success! New User john_doe created');

    const user = await User.findOne({ username: 'john_doe' }).exec();
    expect(user).not.toBeNull();
    expect(user.firstname).toBe('John');
    expect(user.lastname).toBe('Doe');
  });


})

