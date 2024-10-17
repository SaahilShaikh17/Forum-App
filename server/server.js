// server.js
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const app = require('./app'); // Import the Express app

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => console.log(`App running on port ${PORT}`));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});
