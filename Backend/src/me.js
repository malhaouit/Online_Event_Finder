//requests.http;
### Register
POST http://localhost:8080/auth/register
Content-Type: application/json

{
    "name": "Naina",
    "email": "nainahk470@gmail.com",
    "password": "!123Four"
}

// src/index.js;
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

// Routes
app.use('/api/auth', require('./routes/authRoute'));

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(500).send('Internal server error');
});


//src/controllers/authController.js;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');
const emailService = require('../utils/email');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Starting registration process');
        const db = getDB();
        const userCollection = db.collection('users');

        let user = await userCollection.findOne({ email });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        user = {
            name,
            email,
            password: hashedPassword
        };

        await userCollection.insertOne(user);
        console.log('User inserted into database');

        // Send registration email
        await emailService.sendRegistrationEmail(email, name);
        console.log('Registration email sent');

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    throw err;
                }
                console.log('JWT generated');
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).send('Server error');
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = getDB();
        const userCollection = db.collection('users');

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send token in response
            }
        );
    } catch (err) {
        console.error('Error in login controller:', err.message);
        res.status(500).send('Server error in login controller');
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const db = getDB();
        const userCollection = db.collection('users');

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate password reset token (you may want to store and validate it)
        const resetToken = jwt.sign(
            { user: user._id },
            process.env.JWT_RESET_SECRET,
            { expiresIn: '1h' }
        );

        // Example of password reset link (you would send this via email)
        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        // Send password reset email
        await emailService.sendPasswordResetEmail(email, resetLink);

        res.json({ msg: 'Password reset email sent' });
    } catch (err) {
        console.error('Error in resetPassword controller:', err.message);
        res.status(500).send('Server error in resetPassword controller');
    }
};


//src/routes/authRoutes.js;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.get('/register', authController.register);
router.post('/login', authController.login);
router.get('/login', authController.login);
router.post('/reset-passwd', authController.resetPassword);
router.get('/reset-passwd', authController.resetPassword);

module.exports = router
//
