// config/db.js
const mongoose = require('mongoose');

// MongoDB Connection URL
const mongoURI = 'mongodb+srv://beta1:root123@cluster0.4pc6viv.mongodb.net/test'; 

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;