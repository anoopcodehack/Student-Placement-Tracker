const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');
const { seedDatabase } = require('./seed/seed');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Placement Tracker API running' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => seedDatabase())
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
