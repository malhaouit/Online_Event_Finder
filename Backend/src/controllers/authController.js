const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Use the Mongoose model
const emailService = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Register a new user
exports.register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        console.log('Starting registration process');

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

	// Check if password and confirmPassword match
	if (password !== confirmPassword) {
	    return res.status(400).json({ msg: 'Passwords do not match' });
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
        const confirmLink = `${process.env.FRONTEND_URL}/confirm/${confirmationToken}`;
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
                res.json({
                    token,
                    user: {
                      id: user._id,
                      email: user.email,
                      name: user.name,
                    },
                });             }
        );
    } catch (err) {
        console.error('Error in login controller:', err.message);
        res.status(500).send('Server error in login controller');
    }
};

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the token received from Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Find or create the user
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        isEmailConfirmed: true, // Automatically confirm email for Google logins
      });
      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(500).send('Google login error');
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
