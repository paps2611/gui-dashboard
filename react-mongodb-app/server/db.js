// db.js
const NodeStatus = require('./models/DataModel');

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

    const db = mongoose.connection;
    const changeStream = db.collection('nodestatusdb').watch();

    changeStream.on('change', async (change) => {
      console.log('Database change detected:', change);
      try {
        const updatedData = await NodeStatus.find();
        io.emit('dbUpdate', updatedData); // Now matches client listener
      } catch (error) {
        console.error('Error fetching updated data:', error);
      }
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
