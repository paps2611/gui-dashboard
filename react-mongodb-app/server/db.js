// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (io) => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');

    // Once connected, set up a change stream on the collection
    const db = mongoose.connection;
    // NOTE: Adjust the collection name if needed.
    // By default, if your model is "NodeStatus", the collection name will likely be "nodestatuses".
    const changeStream = db.collection('nodestatuses').watch();

    changeStream.on('change', (change) => {
      console.log('Change detected in MongoDB:', change);
      // Emit the change to all connected clients
      io.emit('data-updated', change);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please check:');
    console.error('1. Is MongoDB running?');
    console.error('2. Is the connection string in .env correct?');
    console.error('3. Are there any network issues?');
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
