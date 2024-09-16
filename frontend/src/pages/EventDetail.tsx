import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/EventDetails.css';
import HomeHeader from '../components/HomeHeader/HomeHeader';

type Event = {
  _id: string;
  title: string;
  description: string;
  details?: string;
  date: string;
  location: string;
  capacity?: number;
  image?: string;
  organizer: { name: string; email: string };
  isRegistered: boolean; // Add this field to track registration status
};

function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

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
        setIsRegistered(data.isRegistered); // Set registration status
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

  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');
    const token = localStorage.getItem('token');

    if (!token) {
      setRegisterError('You must be logged in to register.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:7999/api/event/${eventId}/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setRegisterError(data.msg || 'Failed to register for the event');
        return;
      }

      setRegisterSuccess('Successfully registered for the event.');
      setIsRegistered(true); // Update registration status
    } catch (err) {
      setRegisterError('An error occurred while registering.');
    }
  };

  const handleUnregister = async () => {
    setRegisterError('');
    setRegisterSuccess('');
    const token = localStorage.getItem('token');

    if (!token) {
      setRegisterError('You must be logged in to cancel registration.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:7999/api/event/${eventId}/unregister`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setRegisterError(data.msg || 'Failed to cancel registration');
        return;
      }

      setRegisterSuccess('Successfully canceled your registration.');
      setIsRegistered(false); // Update registration status
    } catch (err) {
      setRegisterError('An error occurred while canceling registration.');
    }
  };

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
    <div>
      <HomeHeader />

      <div className="event-details">
        {event.image && <img src={`http://localhost:7999/${event.image}`} alt={event.title} className="event-image" />}

        <div className="event-details-content">
          <div className="event-details-left">
            <h1>{event.title}</h1>
            <p>{event.description}</p>

            {event.details && (
              <div className="event-details-long">
                <label>Event Details</label>
                <p>{event.details}</p>
              </div>
            )}

            <div className="event-info">
              <div>
                <label>Date and time</label>
                <p>{new Date(event.date).toLocaleDateString()}, {new Date(event.date).toLocaleTimeString()}</p>
              </div>
              <div>
                <label>Location</label>
                <p>{event.location}</p>
              </div>
            </div>

            <div className="capacity">
              <label>Capacity</label>
              <p>{event.capacity} Attendees</p>
            </div>

            <div className="organizer-info">
              <label>Organizer</label>
              <p>{event.organizer.name}</p>
              <p>{event.organizer.email}</p>
            </div>
          </div>

          <div className="event-details-right">
            <div className="admission-box">
              <h3>General Admission</h3>
              <p>Free</p>
            </div>
            {isRegistered ? (
              <button className="cta-button" onClick={handleUnregister}>Cancel Registration</button>
            ) : (
              <button className="cta-button" onClick={handleRegister}>Register for this event</button>
            )}
            {registerError && <p className="error">{registerError}</p>}
            {registerSuccess && <p className="success">{registerSuccess}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
