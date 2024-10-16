const { handleNewUser } = require('../controllers/userController');
const User = require('../model/User'); // Mocked model
const bcrypt = require('bcrypt'); // Mocked bcrypt
const httpMocks = require('node-mocks-http'); // For request and response mocks

jest.mock('../model/User'); // Mocking User model
jest.mock('bcrypt'); // Mocking bcrypt library

describe('User Controller - handleNewUser', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = { username: 'testuser' }; // Missing password, fname, and lname

    await handleNewUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Username ,Password,First Name and LastName are required',
    });
  });

  it('should return 409 if the username already exists', async () => {
    req.body = {
      username: 'existinguser',
      password: 'password123',
      firstname: 'John',
      lastname: 'Doe',
    };

    User.findOne.mockResolvedValue({ user: 'existinguser' }); // Mocking duplicate user

    await handleNewUser(req, res);

    expect(res.statusCode).toBe(409);
  });

  it('should create a new user successfully', async () => {
    req.body = {
      username: 'newuser',
      password: 'password123',
      firstname: 'Jane',
      lastname: 'Smith',
    };

    User.findOne.mockResolvedValue(null); // No duplicate user
    bcrypt.hash.mockResolvedValue('hashedpassword'); // Mock hashed password
    User.create.mockResolvedValue({
      firstname: 'Jane',
      lastname: 'Smith',
      username: 'newuser',
      password: 'hashedpassword',
    });

    await handleNewUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(User.create).toHaveBeenCalledWith({
      firstname: 'Jane',
      lastname: 'Smith',
      username: 'newuser',
      password: 'hashedpassword',
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'Success! New User newuser created',
    });
  });

  it('should return 500 if an error occurs during user creation', async () => {
    req.body = {
      username: 'newuser',
      password: 'password123',
      firstname: 'Jane',
      lastname: 'Smith',
    };

    User.findOne.mockResolvedValue(null); // No duplicate user
    bcrypt.hash.mockResolvedValue('hashedpassword'); // Mock hashed password
    User.create.mockRejectedValue(new Error('Database error')); // Mock DB error

    await handleNewUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getData()).toBe('Database error');
  });
});
