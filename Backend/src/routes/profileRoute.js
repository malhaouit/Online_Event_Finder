// src/routes/profileRoute.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to update the profile image
router.post('/update-profile-image', authMiddleware('jwt'), profileController.updateProfileImage);

// Route to fetch the logged-in user's profile
router.get('/me', authMiddleware('jwt'), profileController.getProfile);

// Route to fetch any user's profile by their userId
router.get('/:userId', authMiddleware('jwt'), profileController.getProfileById);

module.exports = router;