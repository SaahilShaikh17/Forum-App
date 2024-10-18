// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/eventLogger');
const errorLogger = require('./middleware/errorLogger');
const verifyJWT = require('./middleware/verifyJWT');

const app = express();

// Middleware setup
app.use(cors({ 
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/register', require('./routes/register'));
app.use('/users', require('./routes/userRoutes'));
app.use('/login', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// Protected routes (require JWT verification)
app.use(verifyJWT);
app.use('/posts', require('./routes/postRoutes'));
app.use('/comments', require('./routes/commentRoute'));

// Error logging middleware
app.use(errorLogger);

module.exports = app;
