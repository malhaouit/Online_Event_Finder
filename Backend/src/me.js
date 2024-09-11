// src/routes/authRoutes.js;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// User registration
router.post('/register', authController.register);

router.get('/confirm/:token', authController.confirmEmail); // Confirmation route

// User login
router.post('/login', authController.login);

// Password reset request (sends the reset email)
router.post('/reset-password', authController.resetPassword);

// Handle actual password reset (user enters new password)
router.post('/reset-password-process', authController.handlePasswordReset);

router.post('/logout', (req, res) => {
  // Simple logout route, no backend action needed for JWT.
  // Client will remove token on logout
  res.json({ msg: 'Logged out successfully' });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Request specific scopes here
  })
);

// Callback route after Google authenticates the user
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // Redirect if authentication fails
  }),
  (req, res) => {
    // Successful authentication, redirect to your app
    res.redirect('/api/event/allEvents'); // Change based on your route setup
  }
);
module.exports = router;



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

// Route
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/event', require('./routes/eventRoute'));


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

// src/config/passport.js;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('JWT Payload:', jwt_payload);
        User.findById(jwt_payload.user.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.error(err));
    }));
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'], // Define scopes here
          },
          async (accessToken, refreshToken, profile, done) => {
            // Check if user exists in your database
            try {
              let user = await User.findOne({ googleId: profile.id });
              if (user) {
                return done(null, user);
              }
      
              // If user doesn't exist, create a new one
              user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
              });
              await user.save();
              done(null, user);
            } catch (error) {
              console.error('Error handling user:', error);
              done(error, null);
            }
          }
        )
      )
};

// src/conntrollers/authController.js;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Use the Mongoose model
const emailService = require('../utils/email');
const dotenv = require('dotenv');
dotenv.config();

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Starting registration process');

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

	// Generate email confirmation token
        const confirmationToken = crypto.randomBytes(20).toString('hex');

        // Create a new user instance
        user = new User({
            name,
            email,
            password: hashedPassword,
	    confirmationToken
        });

        // Save the new user in the database
        await user.save();

	// Send confirmation email
	const confirmLink = `${process.env.BASE_URL}/api/auth/confirm/${confirmationToken}`;
        await emailService.sendConfirmationEmail(email, confirmLink);
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.confirmEmail = async (req, res) => {
    const { token } = req.params;

    try {
       const user = await User.findOne({ confirmationToken: token });
       if (!user) {
           return res.status(400).json({ msg: 'Invalid or expired confirmation token' });
       }

       user.isEmailConfirmed = true;
       user.confirmationToken = undefined;
       await user.save();

       return res.status(200).json({ msg: 'Email confirmed successfully' });
    } catch (err) {
       console.error('Confirm email error:', err.message);
       return res.status(500).send('Server error');
    }
};
    
// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login for email: ${email}`); // Log the input email

    try {
        // Find the user using Mongoose
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
	    console.log('User not found');
            return res.status(400).json({ msg: 'Invalid email' });
        }

        if (!user.isEmailConfirmed) {
            return res.status(400).json({ msg: 'Please confirm your email before logging in' });
	}

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
	console.log('Password match:', isMatch); // Log if password comparison succeeded
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // If password matches, generate a JWT token
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

// Send password reset email
exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email using Mongoose
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate password reset token
        const resetToken = jwt.sign(
            { user: user._id },
            process.env.JWT_RESET_SECRET,
            { expiresIn: '1h' }
        );

        // Create the reset link and send email
	const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        await emailService.sendPasswordResetEmail(email, resetLink);

        res.json({ msg: 'Password reset email sent' });
    } catch (err) {
        console.error('Error in resetPassword controller:', err.message);
        res.status(500).send('Server error in resetPassword controller');
    }
};

// Handle password reset
exports.handlePasswordReset = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded.user);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error('Error in password reset:', err.message);
        res.status(500).send('Server error in password reset');
    }
};
