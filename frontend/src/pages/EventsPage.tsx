import { useLocation, useParams } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    category: string;
  }
  

const EventsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>(); // Get category from URL
  const location = useLocation(); // Get state passed from navigate
  const filteredEvents = location.state?.filteredEvents || [];

  return (
    <div>
      <h2>Events in Category: {category}</h2>
      <ul>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event:Event) => (
            <li key={event.id}>
              {event.title} - Category: {event.category}
            </li>
          ))
        ) : (
          <p>No events found in this category.</p>
        )}
      </ul>
    </div>
  );
};

export default EventsPage;
