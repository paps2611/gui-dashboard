const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const NodeStatus = require('./models/DataModel');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Route for initial data loading
app.get('/api/data', async (req, res) => {
  try {
    const data = await NodeStatus.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New WebSocket client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// MongoDB change stream setup
const mongoose = require('mongoose');
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB, setting up change streams...');

  const nodeStatusCollection = mongoose.connection.collection('nodestatuses');
  const changeStream = nodeStatusCollection.watch();

  changeStream.on('change', async (change) => {
    console.log('Database change detected:', change);

    try {
      const updatedData = await NodeStatus.find();
      io.emit('dataUpdate', updatedData);
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
