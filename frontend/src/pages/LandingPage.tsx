// src/pages/LandingPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

function LandingPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7999/api/event/allEvents', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="salutation">
          {user && <span className="welcome-message">Hello, {user.name}!</span>}
        </div>
        <nav className="landing-nav">
          <a href="/add-event">Add Event</a>
        </nav>
        <div className="user-info">
          {user && (
            <div className="user-dropdown">
              <button className="user-button" onClick={toggleDropdown}>
                {user.name.charAt(0)}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                  {/* Future buttons like Profile Settings will go here */}
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="landing-content">
        <h1>Welcome to the Events Platform</h1>
        <p>Find and manage your events all in one place!</p>
        <div className="events-list">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="event-item">
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p>Date: {event.date}</p>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
