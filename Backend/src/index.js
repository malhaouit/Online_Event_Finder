const cors = require('cors');
const express = require('express');
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

// Route
app.use('/api/auth', require('./routes/authRoute'));

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.timeout = 120000000000;
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(500).send('Internal server error');
});

// const express = require('express');
// const app = express();

// app.use(express.json());

// app.get('/test', (req, res) => {
//     res.send('Test Successful');
// });

// const PORT = 7999;
// app.listen(PORT, () => {
//     console.log(`Server running port ${PORT}`);
// });