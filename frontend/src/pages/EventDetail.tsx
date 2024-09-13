import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventDetails.css';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity?: number;
  image?: string;  // Add the image field to the Event type
};

function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          setError('No event ID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:7999/api/event/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  return (
    <div className="event-details">
      {/* Display the event image if available */}
      {event.image && <img src={`http://localhost:7999/${event.image}`} alt={event.title} className="event-image" />}
      
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <div className="event-info">
        <div>
          <label>Date:</label> {new Date(event.date).toLocaleDateString()}
        </div>
        <div>
          <label>Time:</label> {new Date(event.date).toLocaleTimeString()}
        </div>
        <div>
          <label>Location:</label> {event.location}
        </div>
      </div>

      <div className="capacity">
        <label>Capacity:</label> {event.capacity}
      </div>

      <button className="cta-button">Register for this event</button>
    </div>
  );
}

export default EventDetails;
