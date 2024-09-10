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

    // New function for sending confirmation email
    sendConfirmationEmail: async (email, confirmLink) => {
        try {
            const subject = 'Please confirm your email';
            const text = `Click the following link to confirm your email: ${confirmLink}`;
            const html = `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`;

            const msg = {
                to: email,
                from: process.env.EMAIL_USER,
                subject: subject,
                text: text,
                html: html
            };

            await sgMail.send(msg);
            console.log('Confirmation email sent to:', email);
        } catch (err) {
            console.error('Error sending confirmation email:', err.message);
        }
    }
};
