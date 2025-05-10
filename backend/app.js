const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./src/config/db.config');
const connectSecondaryDB = require('./src/config/secondaryDB'); // ✅ Import secondary DB
const alertRoutes = require('./src/routes/alerts');
const recommendationRoutes = require('./src/routes/recommendations');
const incomeRoutes = require('./src/routes/incomes');
const expenseRoutes = require('./src/routes/expenses');
const cors = require('cors');

const app = express();
const port = 4000;

// ✅ Connect to primary and secondary MongoDB
connectDB();
const secondaryConnection = connectSecondaryDB(); // ✅ This establishes the connection

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
