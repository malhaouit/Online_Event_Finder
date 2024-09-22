import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EventDetails.css';
import HomeHeader from '../components/HomeHeader/HomeHeader';
import { FaEdit } from 'react-icons/fa';

type Event = {
  _id: string;
  title: string;
  description: string;
  details?: string;
  date: string;
  location: string;
  capacity?: number;
  image?: string;
  organizer: { name: string; email: string; _id: string; profileImage?: string };
  isRegistered: boolean;
};

function EventDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          throw new Error('No event ID provided');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:7999/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched event data:', data);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
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
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
      }

      setRegisterSuccess('Successfully registered for the event.');
      setEvent(prev => prev ? { ...prev, isRegistered: true } : null);
    } catch (err) {
      console.error('Error registering for event:', err);
      setRegisterError(err instanceof Error ? err.message : 'An error occurred while registering.');
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
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
      }

      setRegisterSuccess('Successfully canceled your registration.');
      setEvent(prev => prev ? { ...prev, isRegistered: false } : null);
    } catch (err) {
      console.error('Error unregistering from event:', err);
      setRegisterError(err instanceof Error ? err.message : 'An error occurred while canceling registration.');
    }
  };

  const handleUpdateClick = () => {
    navigate(`/update-event/${eventId}`);
  };

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7999/api/event/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Event deleted successfully');
      alert('Event deleted successfully');
      navigate('/');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the event.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
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
            <p dangerouslySetInnerHTML={{ __html: event.description }}></p>

            {event.details && (
              <div className="event-details-long">
                <label>Event Details</label>
                <p dangerouslySetInnerHTML={{ __html: event.details }}></p>
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

            <div className="organizer-container">
              <label className="organizer-label">Organizer</label>
              <div className="organizer-info">
                <img 
                  src={event.organizer.profileImage
                    ? `http://localhost:7999/${event.organizer.profileImage}`
                    : 'https://github.com/malhaouit/helper/blob/main/default%20profile.png?raw=true'}
                  alt="Organizer"
                  className="small-profile-image"
                />
                <div className="organizer-details">
                  <h3>{event.organizer.name}</h3>
                  <button className="view-profile-button" onClick={() => navigate(`/profile/${event.organizer._id}`)}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="event-details-right">
            <div className="admission-box">
              <h3>General Admission</h3>
              <p>Free</p>
            </div>
            {event.isRegistered ? (
              <button className="cta-button" onClick={handleUnregister}>Cancel Registration</button>
            ) : (
              <button className="cta-button" onClick={handleRegister}>Register for this event</button>
            )}
            {registerError && <p className="error">{registerError}</p>}
            {registerSuccess && <p className="success">{registerSuccess}</p>}
          </div>
        </div>

        <div className="delete-event-button">
          <button className="danger-button" onClick={() => setShowDeleteDialog(true)}>
            Delete Event
          </button>
        </div>

        {showDeleteDialog && (
          <>
            <div className="dialog-overlay"></div>
            <div className="delete-confirmation-dialog">
              <div className="dialog-content">
                <h3>Are you sure you want to delete this event?</h3>
                <div className="dialog-actions">
                  <button className="confirm-button" onClick={handleDeleteEvent} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button className="cancel-button" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {error && <p className="error-message">{error}</p>}

      </div>

    </div>
  );
}

export default EventDetails;