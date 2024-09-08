// emailService.js

const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        const msg = {
            to: to,
            from: process.env.EMAIL_USER,
            subject: subject,
            text: text,
            // You can also add html: '<strong>HTML version of the message</strong>' if needed
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
