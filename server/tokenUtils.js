const jwt = require('jsonwebtoken');

// Generate access token with 1-day expiry
const generateAccessToken = (username) => {
    return jwt.sign(
        { username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
};

// Generate refresh token with 1-day expiry
const generateRefreshToken = (username) => {
    return jwt.sign(
        { username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
