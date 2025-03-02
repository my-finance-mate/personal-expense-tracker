import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// MongoDB connection setup
const mongoURI = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME as string;

mongoose.connect(mongoURI, { dbName })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express and MongoDB!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
