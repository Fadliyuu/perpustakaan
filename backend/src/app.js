const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { configureCloudinary } = require('./cloudinary');
const { getFirestore } = require('./firebase');

dotenv.config();
configureCloudinary();
getFirestore(); // ensure initialized

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Perpustakaan API - Backend is running',
    status: 'ok',
    time: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routers
app.use('/api/students', require('./routes/students'));
app.use('/api/books', require('./routes/books'));
app.use('/api/items', require('./routes/items'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/inventories', require('./routes/inventories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;


