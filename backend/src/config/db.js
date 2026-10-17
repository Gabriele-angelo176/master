const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

module.exports = connectDB;
