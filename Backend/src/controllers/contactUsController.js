const ContactUs = require('../models/Contact-Us');
const { sendEmail } = require('../utils/email'); // Use the sendEmail function from email.js

exports.submitContactUs = async (req, res) => {
  const { fullName, email, subject, message } = req.body; // Include subject

  if (!fullName || !email || !subject || !message) { // Check for subject
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    // Store the contact message in the database
    const contactMessage = new ContactUs({
      fullName,
      email,
      subject, // Save the subject
      message,
    });
    await contactMessage.save();

    // Send email notification
    const emailSubject = 'New Contact Us Message';
    const text = `You have received a new message from ${fullName} (${email}):\n\nSubject: ${subject}\n\n${message}`;
    const html = `<p>You have received a new message from <strong>${fullName}</strong> (${email}):</p><p><strong>Subject:</strong> ${subject}</p><p>${message}</p>`;
    await sendEmail(process.env.EMAIL_USER, emailSubject, text, html);

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
