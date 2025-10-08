// backend/db.js
const mongoose = require('mongoose');

// --- Your MongoDB Connection String ---
const mongoURI = 'mongodb+srv://ajaygollapudi1951_db_user:Ajay123@cluster0.eip64vy.mongodb.net/contactlist?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully via db.js');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;