const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
// router.get('/register', authController.register);
router.post('/login', authController.login);
router.get('/login', authController.login);
router.post('/reset-passwd', authController.resetPassword);
router.get('/reset-passwd', authController.resetPassword);

module.exports = router;
