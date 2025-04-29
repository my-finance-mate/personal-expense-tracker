const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db.config');


// Next initialize the application
const app = express();

// routing path
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(3000, () => {
  try{
    // Connect to the database
    connectDB();
  }catch (error) {
    console.error('Error starting the server:', error);
  }
  
  console.log('Server started on port 3000');
});