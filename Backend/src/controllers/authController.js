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

        // Create a new user instance
        user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the new user in the database
        await user.save();
        console.log('User inserted into database');

        // Send registration email
        await emailService.sendRegistrationEmail(email, name);
        console.log('Registration email sent');

        // Create a JWT payload and sign it
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

	console.log('User found, verifying password');

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
        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
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
