// eventControllers.js;
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
            return res.status(400).json({ msg: err });
        } 
        else {
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
                    organizer: user.id // Set the organizer to the user object
                });

                const newEvent = await event.save();

                // Send confirmation email
                await emailService.sendEventConfirmation(user.email, user.name);

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
        const eventsCollection = db.collection('allEvents');
        const events = await eventsCollection.find().toArray();
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// email.js;
// emailService.js

const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        // Define the HTML structure of the email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <header style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #4CAF50;">Online Events Finder</h2>
                </header>
                <main style="line-height: 1.6;">
                    <p>${text}</p>
                </main>
                <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
                    <p>&copy; ${new Date().getFullYear()} Online Events Finder. All rights reserved.</p>
                    <p>Follow us on <a href="https://www.example.com" style="color: #4CAF50; text-decoration: none;">Facebook</a> | <a href="https://www.example.com" style="color: #4CAF50; text-decoration: none;">Twitter</a></p>
                </footer>
            </div>
        `;

        const msg = {
            to: to,
            from: process.env.EMAIL_USER,
            subject: subject,
            text: text, // Plain text version for non-HTML clients
            html: htmlContent, // HTML version of the email
        };

        await sgMail.send(msg);
        console.log('Email sent successfully to:', to);
    } catch (err) {
        console.error('Error sending email:', err.message);
    }
};

module.exports = {
    sendRegistrationEmail: async (email, name) => {
        try {
            const subject = 'Welcome to Online Events Finder!';
            const text = `Hello ${name},\n\nWelcome to Online Events Finder. We're excited to have you on board!`;

            await sendEmail(email, subject, text);
        } catch (err) {
            console.error('Error sending registration email:', err.message);
        }
    },

    sendEventRegistrationEmail: async (email, name, eventName) => {
        try {
            const subject = 'Event Registration Confirmation';
            const text = `Hello ${name},\n\nYou have successfully registered for the event "${eventName}".`;

            await sendEmail(email, subject, text);
        } catch (err) {
            console.error('Error sending event registration email:', err.message);
        }
    },

    sendPasswordResetEmail: async (email, resetLink) => {
        try {
            const subject = 'Password Reset Request';
            const text = `Hello,\n\nYou have requested to reset your password. Please follow this link to reset your password: ${resetLink}`;

            await sendEmail(email, subject, text);
        } catch (err) {
            console.error('Error sending password reset email:', err.message);
        }
    },
};



Here are my server logs;
Attempting login for email: nainahk470@gmail.com
User found, verifying password
Password match: true
JWT Payload: {
  user: {
    id: '66df03edc5c1fefd6985340f',
    email: 'nainahk470@gmail.com',
    name: 'Naina'
  },
  iat: 1725968352,
  exp: 1725971952
}
User after authentication: {
  _id: new ObjectId('66df03edc5c1fefd6985340f'),
  name: 'Naina',
  email: 'nainahk470@gmail.com',
  password: '$2b$10$eUdBtWKTNtyzNWwh4LmPlOkKXM7MNyDNsaKKKOyOfKgCQToNnsQeS',     
  __v: 0
}
emailService.sendEventConfirmation is not a function
