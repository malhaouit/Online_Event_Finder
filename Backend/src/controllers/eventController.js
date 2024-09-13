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
            console.error('File upload error:', err);
            return res.status(400).json({ msg: err });
        } else {
            const { title, description, date, time, location, image, capacity } = req.body;

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
                    date,
                    time,
                    location,
                    image: req.file ? req.file.path : null,
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
        const event = await Event.findById(id).populate('organizer', 'name email'); // Optionally populate the organizer details
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
	}
        res.json(event);
    } catch (err) {
	console.error('Error fetching event details:', err.message);
        res.status(500).send('Server error');
    }
};
