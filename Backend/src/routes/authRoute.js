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

module.exports = router;
