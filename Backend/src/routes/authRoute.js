const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// User registration
router.post('/register', authController.register);

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

module.exports = router;
