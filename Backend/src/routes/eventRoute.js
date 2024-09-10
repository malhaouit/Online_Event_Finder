const express = require('express');
const router = express.Router();
const passport = require('passport');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware('jwt'), (req, res, next) => {
    console.log('User after authentication:', req.user); // Add for debugging
    next();
}, eventController.createEvent);
router.get('/allEvents', authMiddleware('jwt'), eventController.getEvents);

module.exports = router;
