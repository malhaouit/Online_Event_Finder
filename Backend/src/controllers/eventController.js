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
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const db = getDB();
        const eventsCollection = db.collection('events');
        
        const events = await eventsCollection.find()
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalEvents = await eventsCollection.countDocuments();
        const totalPages = Math.ceil(totalEvents / limit);

        res.json({
            events,
            currentPage: page,
            totalPages,
            totalEvents
        });
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
        const event = await Event.findById(id).populate('organizer', 'name email profileImage').select('title description details date time location image capacity organizer registeredUsers');

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
	}

	// Check if the user is logged in
	const userId = req.user ? req.user.id : null;

	// Check if the user is registered for the event
        const isRegistered = userId && Array.isArray(event.registeredUsers) ? event.registeredUsers.some(user => user.toString() === userId): false;

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

        // Get the user details from req.user (assuming you're using some authentication middleware)
        const user = {
            name: req.user.name,
            email: req.user.email
        };

        // Send registration confirmation email
        const eventDetails = {
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            image: event.image  // Include the image if present
        };

        // Call the email service to send the confirmation email
        await emailService.sendEventRegistrationEmail(user.email, user.name, eventDetails, event.image);

        return res.json({ msg: 'Successfully registered for the event and confirmation email sent.' });
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

exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;  // Get the current logged-in user
        const page = parseInt(req.query.page) || 1;  // Handle pagination
        const limit = parseInt(req.query.limit) || 10;  // Default limit is 10
        const skip = (page - 1) * limit;

        // Fetch events created by the user
        const events = await Event.find({ organizer: userId })
            .skip(skip)
            .limit(limit)
            .populate('registeredUsers');  // Populate registered users to get the count

        const totalEvents = await Event.countDocuments({ organizer: userId });
        const totalPages = Math.ceil(totalEvents / limit);

        res.json({
            events,
            currentPage: page,
            totalPages,
            totalEvents,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRegisteredEvents = async (req, res) => {
    try {
        const userId = req.user.id;  // Get the current logged-in user
        const page = parseInt(req.query.page) || 1;  // Handle pagination
        const limit = parseInt(req.query.limit) || 10;  // Default limit is 10
        const skip = (page - 1) * limit;

        // Fetch events where the user is registered
        const events = await Event.find({ registeredUsers: userId })
            .skip(skip)
            .limit(limit);

        const totalEvents = await Event.countDocuments({ registeredUsers: userId });
        const totalPages = Math.ceil(totalEvents / limit);

        res.json({
            events,
            currentPage: page,
            totalPages,
            totalEvents,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update event by ID, including image upload
exports.updateEvent = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'Image size should be less than 1MB.' });
        }
        return res.status(400).json({ msg: 'File upload error.' });
      }
  
      const { title, description, details, date, time, location, capacity } = req.body;
      const eventId = req.params.id;
  
      try {
        const event = await Event.findById(eventId);
  
        if (!event) {
          return res.status(404).json({ msg: 'Event not found' });
        }
  
        // Update fields with new data
        event.title = title || event.title;
        event.description = description || event.description;
        event.details = details || event.details;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.capacity = capacity || event.capacity;
  
        // If a new image is uploaded, update the image field
        if (req.file) {
          event.image = `uploads/${req.file.filename}`;
        }
  
        // Save the updated event
        const updatedEvent = await event.save();
  
        res.json(updatedEvent);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });
  };  