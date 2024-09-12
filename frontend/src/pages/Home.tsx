import HomeHeader from '../components/HomeHeader/HomeHeader'; // Updated import
import Hero from '../components/Hero/Hero';
import Container from '../components/Container/Container';
import  UpcomingEvents  from '../components/UpcomingEvents/UpcomingEvents';
import EventsByCategory from '../components/EventsByCategory/EventsByCategory';
import AboutSection from '../components/AboutSection/AboutSection';
import Footer from '../components/Footer/Footer'


function Home() {
  return (
    <div>
      <HomeHeader /> {/* Display the HomeHeader at the top */}
      {/* Add other components or content here */}
      <Container>
      <Hero />
      <UpcomingEvents/>
      <EventsByCategory />
      <AboutSection />
     
      </Container>
      <Footer/>
    </div>
  );
}

export default Home;
