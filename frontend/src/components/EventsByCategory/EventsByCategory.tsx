import './EventsByCategory.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Education_image from '../../assets/Education_image.jpg';
import Food_image from '../../assets/Food_image.jpg';
import Health_image from '../../assets/Health_image.jpg';
import Business_image from '../../assets/Business_image.jpg';
import More_image from '../../assets/More_image.jpg';
import Sport_image from '../../assets/Sport_image.jpg';

type Event = {
  _id: string;
  title: string;
  description: string;
  details?: string;
  date: string;
  location: string;
  capacity?: number;
  image?: string;
  category?: string;
  organizer: { name: string; email: string; _id: string; profileImage?: string };
  isRegistered: boolean;
};

interface EventsByCategoryProps {
  category: string;
}

const categories = [
  { image: Education_image, title: 'Education' },
  { image: Food_image, title: 'Food' },
  { image: Health_image, title: 'Health' },
  { image: Business_image, title: 'Business' },
  { image: Sport_image, title: 'Sport' },
  { image: More_image, title: 'More' },
];

const Events: React.FC = () => {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:7999/api/event/allEvents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedEvents(data.events); // Access the "events" property from your backend response
        } else {
          console.error('Failed to fetch events:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents(); // Immediately invoke the async function
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div>
      <EventsByCategory category="someCategory" events={selectedEvents} />
    </div>
  );
};

const EventsByCategory: React.FC<EventsByCategoryProps & { events: Event[] }> = ({ events }) => {
  const navigate = useNavigate(); // For programmatically navigating the user

  // Filter events by selected category
  const categoryByTitle = (selectedCategory: string) => {
    return events.filter((event) => event.category === selectedCategory);
  };

  // Handle click on category
  const handleCategoryClick = (category: string) => {
    const filteredEvents = categoryByTitle(category); // Get events in this category

    // Navigate to a new page and pass the filtered events (or just navigate by category)
    navigate(`/events/${category.toLowerCase()}`, { state: { filteredEvents } });
  };

  return (
    <div className='section-wrapper'>
      <div className='section-header'>
        <h4>Events By Category</h4>
      </div>

      <div className='EventsByCategory-items'>
        {categories.map((categoryItem, index) => (
          <div
            key={index}
            className='EventsByCategory-item'
            onClick={() => handleCategoryClick(categoryItem.title)} // Handle click event
            style={{ cursor: 'pointer' }}
          >
            <img src={categoryItem.image} alt={categoryItem.title} />
            <h4 className='EventsByCategory-item-title'>{categoryItem.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
