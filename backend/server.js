const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load env vars
dotenv.config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');
const campaignRoutes = require('./routes/campaigns');
const artRoutes = require('./routes/art');

const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task-manager';
    await mongoose.connect(connStr);
    console.log('MongoDB Connected successfully.');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.log('Ensure MongoDB local server is running or provide a valid MONGODB_URI in .env');
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/art', artRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'TaskForge API is running.' });
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Client joins a room
  socket.on('join', ({ userId, role }) => {
    if (role === 'admin') {
      socket.join('admins');
      console.log(`Admin joined admins channel: ${socket.id}`);
    } else if (userId) {
      socket.join(userId);
      console.log(`User joined personal room: ${userId}`);
    }
  });

  // Client sends message
  socket.on('sendMessage', async ({ userId, senderId, senderName, text, isAdminSender }) => {
    try {
      if (!userId || !senderId || !text.trim()) return;

      // Save message in MongoDB
      const msg = await Message.create({
        user: userId,
        sender: senderId,
        senderName: senderName,
        text: text,
        isAdminSender: !!isAdminSender,
      });

      console.log(`Saved message: "${text}" from ${senderName}`);

      // Broadcast message
      // 1. Send to user's personal room (so user and admin viewing thread get it)
      io.to(userId).emit('message', msg);

      // 2. If user sent it, alert the admins channel so thread list updates in real-time
      if (!isAdminSender) {
        io.to('admins').emit('message', msg);
      }
    } catch (err) {
      console.error(`Socket sendMessage error: ${err.message}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
