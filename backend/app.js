const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db.config');
const connectSecondaryDB = require('./src/config/secondaryDB');
const { initializeTransactionNotifications } = require('./src/controllers/notificationController');
const alertRoutes = require('./src/routes/alerts');
const recommendationRoutes = require('./src/routes/recommendations');
const incomeRoutes = require('./src/routes/incomes');
const expenseRoutes = require('./src/routes/expenses');
const cors = require('cors');

const app = express();
const port = 4000;

// Connect to both MongoDB instances
const startServer = async () => {
  try {
    await connectDB(); // Connect to primary DB
    const secondaryConnection = await connectSecondaryDB(); // Connect to secondary DB

    // Initialize notifications for existing transactions
    await initializeTransactionNotifications();
    console.log('✅ Transaction notifications initialized');

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => res.send('Hello, MongoDB!'));

    app.use('/alerts', alertRoutes);
    app.use('/recommendations', recommendationRoutes);
    app.use('/incomes', incomeRoutes);
    app.use('/expenses', expenseRoutes);

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
