
const express = require('express');
const cors = require('cors');
const http = require('http');                          // ← ADD
const { Server } = require('socket.io');              // ← ADD
const { emitNotification } = require('./socket/socketHandler'); // ← ADD
const { connectDB } = require('./database');
const { seedDatabase } = require('./seed/seed');
require('dotenv').config();

const app = express();
const server = http.createServer(app);                // ← ADD

// ← ADD socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.32.1:3001',
      process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// attach io to app so routes can access it
app.set('io', io);                                    // ← ADD

// ← ADD socket connection handler
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.32.1:3001',
      process.env.CLIENT_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/profile', require('./routes/profile'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/placements', require('./routes/placements'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/ats', require('./routes/ats'));
app.use('/api/mock-interview', require('./routes/mockInterview'));

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
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)); // ← server.listen not app.listen
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1);
      }
      throw err;
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });