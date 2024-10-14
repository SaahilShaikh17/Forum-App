//Server.js
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConnection');

const PORT = process.env.PORT || 1337;

//connecting to database 
connectDB();


//Built in middleare to handle urlencoded data, a.k.a, form data
// 'content-type: application/x-www=form-urlencoded'
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

  
app.use('/register',require('./routes/register'));
app.use('/login',require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

mongoose.connection.once('open',() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`App running on port ${PORT}`));
});

//mongodb+srv://saahils191:<db_password>@forum-app-cluster.7et5d.mongodb.net/?retryWrites=true&w=majority&appName=forum-app-cluster