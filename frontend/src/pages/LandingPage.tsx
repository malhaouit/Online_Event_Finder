
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../styles/LandingPage.css';
import logo from '../assets/logo.svg'; // Replace with your actual logo path


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

const LandingPage = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [paginatedEvents, setPaginatedEvents] = useState<PaginatedEvents | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from local storage
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();

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
          totalEvents: data.length,
        });
      } else {
        console.error('Failed to search events:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    setDropdownVisible(false); // Close the dropdown when navigating
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="greetings">
          {user && <span className="welcome-message">HEEY THERE, {user.name}!</span>}
          </div>
          <div className="home-header-logo">
        <a href="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </a>
      </div>
        {user && (
          <div className="user-section">
            <button
              className="user-button"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            {dropdownVisible && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => handleNavigate('/addEvent')}>
                  Add Events
                </button>
                <button className="dropdown-item" onClick={() => handleNavigate('/myEvents')}>
                  My Events
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main>
        <p>Explore and register for the latest events!</p>

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
                    <p dangerouslySetInnerHTML={{ __html: event.description }}></p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Location: {event.location}</p>
                    <button onClick={() => navigate(`/event/${event._id}`)} className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button 
                  onClick={() => handleNavigate(`/allEvents?page=${currentPage - 1}`)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>{currentPage} of {paginatedEvents.totalPages}</span>
                <button 
                  onClick={() => handleNavigate(`/allEvents?page=${currentPage + 1}`)} 
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
      </main>
    </div>
  );
};

export default LandingPage;
