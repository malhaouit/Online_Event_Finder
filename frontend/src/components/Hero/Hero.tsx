import './Hero.css'
import HeroImage from '../../assets/HeroImage.jpg';

function Hero() {
  return (
    <div className='hero-main'>
      <img src={HeroImage} alt="Hero" className='hero-image' />
    </div>
  )
  
}

export default Hero