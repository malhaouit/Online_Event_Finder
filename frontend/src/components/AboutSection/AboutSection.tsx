import './AboutSection.css'
import About_image from '../../assets/About_image.png'
import { Link } from 'react-router-dom'


const AboutSection = () => {
 

  return (
    <div id="about-section">
    <div className='section-wrapper'>
       <div className='section-header'>
        <h4 className='About-title'> About Online Events Finder</h4>
       </div>
       <span className='About-text'>Online Events Finder is a comprehensive platform designed to help you discover and explore virtual events across the globe. Whether you're searching for webinars, online workshops, virtual conferences, or digital exhibitions, we make it easy for you to find the perfect event to suit your interests.
Our platform is tailored for both attendees looking to expand their knowledge and network, and organizers aiming to reach a broader audience. Join us in navigating the ever-growing world of online events, and stay connected from anywhere in the world.</span>
<div className='section-header'>
        <h4 className='About-title-2'> Planning to Host an Online Event?</h4>
       </div>
       <div className='AboutSectionEvent'>
       <span className='About-text-2'>Do you have a webinar, virtual conference, or online workshop coming up? Promoting your digital events has never been easier. With the rise of advanced digital tools and dedicated platforms, getting the word out about your upcoming events is now just a click away.</span>
       <img className='About-image' src={About_image}/>
       </div>
       <div>
       <Link to="/get-in-touch" >
          <button className='more-events-button'>Get In Touch</button>
        </Link>
        </div>
        
      </div>
    </div>
    
  )
}

export default AboutSection