// Middleware to verify JWT token and set req.user.id
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Unauthorized
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Invalid token
        
        // Set req.user.id to the user ID from the decoded token
        req.user = {
            id: decoded.username
        };
        next();
    });
};

module.exports = verifyJWT;