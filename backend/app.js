const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db.config')
const alertRoutes = require('./src/routes/alerts');
const recommendationRoutes = require('./src/routes/recommendations');
const cors = require('cors');


const app = express();
const port = 4000;

// Connect to MongoDB
connectDB();

app.use(cors());
// Middleware to parse JSON (if needed)
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB!');
});

app.use('/alerts', alertRoutes);
app.use('/recommendations', recommendationRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});