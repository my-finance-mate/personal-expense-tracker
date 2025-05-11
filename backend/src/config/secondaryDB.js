const mongoose = require('mongoose');

const connectSecondaryDB = () => {
  const connection = mongoose.createConnection(process.env.MONGO_URI2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.on('connected', () => {
    console.log('Connected to secondary MongoDB (Income/Expense DB)');
  });

  connection.on('error', (err) => {
    console.error('Error in secondary DB connection:', err);
  });

  return connection;
};

module.exports = connectSecondaryDB;
