// emailService.js

const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, htmlContent) => {
    try {
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

// Corrected exports: Make sure all functions are properly exported
module.exports = {
    sendRegistrationEmail: async (email, name) => {
        const subject = 'Welcome to Online Events Finder!';
        const text = `Hello ${name},\n\nWelcome to Online Events Finder. We're excited to have you on board!`;
        const html = `<p>Welcome, <strong>${name}</strong>! We're thrilled to have you join us at Online Events Finder.</p>`;
        await sendEmail(email, subject, text, html);
    },

    sendEventRegistrationEmail: async (email, name, eventName) => {
        const subject = 'Event Registration Confirmation';
        const text = `Hello ${name},\n\nYou have successfully registered for the event "${eventName}".`;
        const html = `<p>Hi <strong>${name}</strong>, you've successfully registered for <strong>${eventName}</strong>.</p>`;
        await sendEmail(email, subject, text, html);
    },

    sendPasswordResetEmail: async (email, resetLink) => {
        const subject = 'Password Reset Request';
        const text = `Hello,\n\nYou have requested to reset your password. Please follow this link to reset your password: ${resetLink}`;
        const html = `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`;
        await sendEmail(email, subject, text, html);
    },

    sendConfirmationEmail: async (email, confirmLink) => {
        const subject = 'Please confirm your email';
        const text = `Click the following link to confirm your email: ${confirmLink}`;
        const html = `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`;
        await sendEmail(email, subject, text, html);
    },

    sendEventConfirmation: async (email, name, eventDetails) => {
        const { title, date, time, location } = eventDetails;
        const subject = 'Event Created Successfully!';
        const text = `Hello ${name},\n\nYour event "${title}" has been successfully created. Here are the details:\n\nDate: ${date}\nTime: ${time}\nLocation: ${location}\n\nWe look forward to seeing you there!`;
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <header style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #4CAF50;">Online Events Finder</h2>
                </header>
                <main style="line-height: 1.6;">
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>Your event "<strong>${title}</strong>" has been successfully created. Here are the event details:</p>
                    <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Event Name:</strong> ${title}</li>
                        <li><strong>Date:</strong> ${date}</li>
                        <li><strong>Time:</strong> ${time}</li>
                        <li><strong>Location:</strong> ${location}</li>
                    </ul>
                    <p>We look forward to seeing you there!</p>
                </main>
                <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
                    <p>&copy; ${new Date().getFullYear()} Online Events Finder. All rights reserved.</p>
                </footer>
            </div>
        `;
        await sendEmail(email, subject, text, html);
    }
};
