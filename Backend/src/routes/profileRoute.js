// src/routes/profileRoute.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to update the profile image
router.post('/update-profile-image/:userId', authMiddleware('jwt'), profileController.updateProfileImage);

// Route to fetch user profile data
router.get('/:userId', profileController.getProfile);

module.exports = router;