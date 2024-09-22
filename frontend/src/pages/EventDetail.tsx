import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Add useNavigate here
import '../styles/EventDetails.css';
import HomeHeader from '../components/HomeHeader/HomeHeader';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon

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
  const navigate = useNavigate(); // Hook to navigate between pages

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!eventId) {
          setError('No event ID provided');
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:7999/api/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      setEvent(prev => prev ? { ...prev, isRegistered: true } : null);
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
      setEvent(prev => prev ? { ...prev, isRegistered: false } : null);
    } catch (err) {
      setRegisterError('An error occurred while canceling registration.');
    }
  };

  // Handler for clicking the update icon
  const handleUpdateClick = () => {
    navigate(`/update-event/${eventId}`);
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
  
      if (response.ok) {
        alert('Event deleted successfully');
        navigate('/'); // Redirect to home or another page after deletion
      } else {
        setError('Failed to delete event.');
      }
    } catch (error) {
      setError('Error deleting event.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <HomeHeader />

      <div className="event-details">
        {event.image && <img src={`http://localhost:7999/${event.image}`} alt={event.title} className="event-image" />}

        <div className="event-details-content">
          <div className="event-details-left">
            <h1>{event.title}</h1>
            {/* Render the description and details using dangerouslySetInnerHTML */}
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
              <label className="organizer-label">Organizer</label> {/* Add this label */}
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

        {/* Delete Event Button */}
        <div className="delete-event-button">
          <button className="danger-button" onClick={() => setShowDeleteDialog(true)}>
            Delete Event
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteDialog && (
          <>
            <div className="dialog-overlay"></div> {/* Add this */}
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

        {/* Display error if any */}
        {error && <p className="error-message">{error}</p>}

      </div>

    </div>
  );
}

export default EventDetails;