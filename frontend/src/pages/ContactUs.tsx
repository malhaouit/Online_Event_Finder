import { HomeHeader } from '../components'
import Footer from '../components/Footer/Footer'
import '../styles/ContactUs.css'
import { FaFacebook, FaTwitter, FaLinkedin , FaEnvelope } from 'react-icons/fa';


const ContactUs = () => {
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
        <span className='test-contact'>Feel free to drop us mail. </span>
        <input
          type="Name"
          placeholder="Enter your Full Name"
          className="Contact-input"
        />
        <input
          type="email"
          placeholder="Enter your Email"
          className="Contact-input"
        />
           <textarea
          placeholder="Message"
          className="Contact-input"
          ></textarea>
         <div className="Contact-button-container">
        <button className="Contact-button">Submit</button>
      </div>
        </div>
        <div className='card-2'>
        <h4>CONTACT DETAIL</h4>
        <div className="Contact-detail-item">
              <FaEnvelope className="Contact-icon" />
              <span>info@onlineeventfinder.com</span>
            </div>
        <div className="contact-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      </div>


        </div>

      </div>
    </div>
    <Footer/>
    </>
  )
}

export default ContactUs