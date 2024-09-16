const Event = require('../models/Event');
const { getDB } = require('../config/db');
const multer = require('multer');
const path = require('path');
const emailService = require('../utils/email');

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

exports.createEvent = (req, res) => {
    if (req.body.skipImageUpload) {
        req.file = null;
    }
    upload(req, res, async (err) => {
        if (err) {
	    if (err.code === 'LIMIT_FILE_SIZE') {
		console.log('File upload error:', err);
		return res.status(400).json({ msg: 'Image size should be less than 1MB.' });
	    }
            console.error('File upload error:', err);
            return res.status(400).json({ msg: 'File upload error.' });
        } else {
            const { title, description, details, date, time, location, image, capacity } = req.body;

            try {
                const db = getDB();
                const eventsCollection = db.collection('allEvents');

                const user = {
                    id: req.user.id,
                    email: req.user.email,
                    name: req.user.name
                };

                const event = new Event({
                    title,
                    description,
		    details,
                    date,
                    time,
                    location,
                    image: req.file ? `uploads/${req.file.filename}` : null,
                    capacity,
                    organizer: user.id
                });

                const newEvent = await event.save();

                const eventDetails = {
                    title,
                    date,
                    time,
                    location
                };
                await emailService.sendEventConfirmation(user.email, user.name, eventDetails);

                res.json(newEvent);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        }
    });
};

exports.getEvents = async (req, res) => {
    try {
        const db = getDB();
        const eventsCollection = db.collection('events');
        const events = await eventsCollection.find().toArray();
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// Search for events by title, description, or location
exports.searchEvents = async (req, res) => {
    try {
	const query = req.query.q; // Get the search query from the request

	// Ensure the query is a string
	if (!query || typeof query !== 'string') {
	    return res.status(400).json({ msg: 'Invalid search query' });
	}

	    // Perform a case-insensitive search for events using the query in title or description
        const events = await Event.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },  // Case-insensitive search on title
                { description: { $regex: query, $options: 'i' } },  // Case-insensitive search on description
            ]
        });

        res.json(events);
    } catch (error) {
        console.error('Error searching events:', error.message);
        res.status(500).send('Server error');
    }
};

// Fetch event details by ID
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id).populate('organizer', 'name email').select('title description details date time location image capacity organizer');

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
	}

	// Check if the user is registered for the event
        const isRegistered = Array.isArray(event.registeredUsers) && event.registeredUsers.some(user => user.toString() === userId);

	// Add the `isRegistered` field to the event data
	const eventWithRegistrationStatus = {
	    ...event._doc,  // Spread the original event document
	    isRegistered    // Add the dynamic field
	};

        res.json(eventWithRegistrationStatus);
    } catch (err) {
	console.error('Error fetching event details:', err.message);
        res.status(500).send('Server error');
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const { id } = req.params;  // Event ID from URL
        const userId = req.user.id;  // Current logged-in user
    
        const event = await Event.findById(id);

	if (!event) {
	    return res.status(404).json({ msg: 'Event not found' });
	}
    
	// Check if the user is already registered
	if (event.registeredUsers.includes(userId)) {
	    return res.status(400).json({ msg: 'You have already registered for this event.' });
	}

	// Check if the event has available capacity
	if (event.registeredUsers.length >= event.capacity) {
	    return res.status(400).json({ msg: 'This event is fully booked.' });
	}

	// Register the user
	event.registeredUsers.push(userId);
	await event.save();

	return res.json({ msg: 'Successfully registered for the event.' });
    } catch (err) {
	console.error(err.message);
	return res.status(500).send('Server error');
    }
};

exports.cancelRegistration = async (req, res) => {
    const { id } = req.params; // event ID
    const userId = req.user.id; // get user ID from authenticated request

    try {
	const event = await Event.findById(id);
	if (!event) {
	    return res.status(404).json({ msg: 'Event not found' });
	}

	// Check if the user is registered for the event
	if (!event.registeredUsers.includes(userId)) {
            return res.status(400).json({ msg: 'You are not registered for this event' });
	}

	// Remove the user from the registeredUsers list
	event.registeredUsers = event.registeredUsers.filter(user => user.toString() !== userId);
	await event.save();
	
	res.json({ msg: 'Successfully canceled registration' });
    } catch (err) {
	console.error(err.message);
	res.status(500).send('Server error');
    }
};
