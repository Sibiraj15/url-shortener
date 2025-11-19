require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');
const redirectRoutes = require('./routes/redirect');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health check endpoint
app.get('/healthz', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    const isConnected = mongoose.connection.readyState === 1;

    res.status(isConnected ? 200 : 503).json({
      ok: isConnected,
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: isConnected ? 'connected' : 'disconnected'
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// API Routes
app.use('/api', apiRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/code/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get('/health', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'health.html'));
});

// Redirect routes (must be last)
app.use('/', redirectRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});

module.exports = app;