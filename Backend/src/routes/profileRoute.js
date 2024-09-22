const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to fetch the logged-in user's profile (requires authentication)
router.get('/me', authMiddleware('jwt'), profileController.getLoggedInUserProfile);

// Route to fetch user profile data (public access)
router.get('/:userId', profileController.getProfile);

// Route to update the profile image (requires authentication)
router.post('/update-profile-image', authMiddleware('jwt'), profileController.updateProfileImage);

module.exports = router;