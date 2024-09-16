import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LandingPage.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

interface PaginatedEvents {
  events: Event[];
  currentPage: number;
  totalPages: number;
  totalEvents: number;
}

function LandingPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [paginatedEvents, setPaginatedEvents] = useState<PaginatedEvents | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

    fetchEvents(currentPage);
  }, [currentPage]);

  const fetchEvents = async (page: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7999/api/event/allEvents?page=${page}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaginatedEvents(data);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7999/api/event/search?q=${searchQuery}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaginatedEvents({
          events: data,
          currentPage: 1,
          totalPages: 1,
          totalEvents: data.length
        });
      } else {
        console.error('Failed to search events:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="salutation">
          {user && <span className="welcome-message">Hello, {user.name}!</span>}
        </div>
        <nav className="landing-nav">
          <Link to="/add-event">Add Event</Link>
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
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="landing-content">
        <h1>Welcome to the Events Platform</h1>
        <p>Find and manage your events all in one place!</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="events-list">
          {paginatedEvents && paginatedEvents.events.length > 0 ? (
            <>
              {paginatedEvents.events.map((event) => (
                <div key={event._id} className="event-item">
                  {event.image && (
                    <img src={`http://localhost:7999/${event.image}`} alt={event.title} className="event-image" />
                  )}
                  <div className="event-details">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Location: {event.location}</p>
                    <Link to={`/event/${event._id}`} className="view-details-btn">View Details</Link>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>{currentPage} of {paginatedEvents.totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === paginatedEvents.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
