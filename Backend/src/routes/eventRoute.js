const express = require('express');
const router = express.Router();
const passport = require('passport');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware('jwt'), (req, res, next) => {
    console.log('User after authentication:', req.user); // Add for debugging
    next();
}, eventController.createEvent);
// router.get('/allEvents', authMiddleware('jwt'), eventController.getEvents);
router.get('/allEvents', eventController.getEvents);
router.get('/search', eventController.searchEvents);

router.get('/:id', eventController.getEventById);

router.post('/:id/register', authMiddleware('jwt'), eventController.registerForEvent);

router.post('/:id/unregister', authMiddleware('jwt'), eventController.cancelRegistration);

router.get('/events_created', authMiddleware('jwt'), eventController.getUserEvents);
router.get('/events_registered', authMiddleware('jwt'), eventController.getRegisteredEvents);

router.put('/:id', authMiddleware('jwt'), eventController.updateEvent);

module.exports = router;
