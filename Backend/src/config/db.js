const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      dbName: 'Main', // Specify your database name here
      bufferCommands: false, // Disable buffering
      serverSelectionTimeoutMS: 1000000000, // Extend timeout to 60 seconds (adjust as needed)
    });

    console.log("Connected to MongoDB!");

    // Optionally, you can log a ping to confirm successful connection
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    await admin.ping();

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
}

function getDB() {
  return mongoose.connection.db;
}

module.exports = { connectDB, getDB };
