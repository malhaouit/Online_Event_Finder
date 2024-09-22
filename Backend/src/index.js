const cors = require('cors');
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());
require('./config/passport')(passport);
app.use(cors());



// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/event', require('./routes/eventRoute'));
app.use('/api/profile', require('./routes/profileRoute'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


const PORT = process.env.PORT;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.timeout = 2147483647;
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(500).send('Internal server error');
});
