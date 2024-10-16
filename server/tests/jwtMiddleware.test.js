const jwt = require('jsonwebtoken');
const verifyJWT = require('../middleware/verifyJWT');
require('dotenv').config({ path: '.env.test' });

describe('JWT Middleware', () => {
  it('should return 403 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = { sendStatus: jest.fn() };

    verifyJWT(req, res, jest.fn());
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should allow access if token is valid', () => {
    const token = jwt.sign({ username: 'testuser' }, process.env.ACCESS_TOKEN_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();

    verifyJWT(req, {}, next);
    expect(next).toHaveBeenCalled();
  });
});
