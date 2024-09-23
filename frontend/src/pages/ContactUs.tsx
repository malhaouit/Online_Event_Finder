import { useState } from 'react';
import { HomeHeader } from '../components';
import Footer from '../components/Footer/Footer';
import '../styles/ContactUs.css';
import axios from 'axios';

const ContactUs = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(''); // Added subject field
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:7999/api/contact/contact-us', {
        fullName,
        email,
        subject,  // Send subject field in the request body
        message,
      });

      if (response.status === 200) {
        setStatusMessage('Message sent successfully!');
      } else {
        setStatusMessage('Error submitting the form.');
      }

      // Clear form after successful submission
      setFullName('');
      setEmail('');
      setSubject('');  // Clear the subject field
      setMessage('');
    } catch (error) {
      console.error('Form submission error:', error);
      setStatusMessage('Error submitting the form. Please try again.');
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="section-wrapper">
        <div className="section-header">
          <h4>Contact Us</h4>
        </div>
        <div className="Get-in-touch">
          <div className='Card-1'>
            <h4>GET IN TOUCH</h4>
            <span className='test-contact'>Feel free to drop us a mail.</span>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your Full Name"
                className="Contact-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter your Email"
                className="Contact-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Subject"  // Added input field for subject
                className="Contact-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <textarea
                placeholder="Message"
                className="Contact-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="Contact-button-container">
                <button className="Contact-button" type="submit">Submit</button>
              </div>
              {statusMessage && <p>{statusMessage}</p>}
            </form>
          </div>
          
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
