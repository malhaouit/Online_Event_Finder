import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeHeader.css';
import logo from '../../assets/logo.svg'; // Replace with your actual logo path
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaCalendarPlus } from 'react-icons/fa';

function HomeHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // Assuming the user info is stored in localStorage

  // Fetch matching events as the user types
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length > 2) {
        const response = await fetch(`http://localhost:7999/api/event/search?q=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="home-header">
      {/* Logo */}
      <div className="home-header-logo">
        <a href="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </a>
      </div>

      {/* Search Bar with Icon */}
      <div className="home-header-search">
        <img
          src={searchIcon}
          alt="Search Icon"
          className="search-icon"
          onClick={handleSearch}
        />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {searchResults.length > 0 && (
          <ul className="search-dropdown">
            {searchResults.map((event) => (
              <li key={event._id} onClick={() => handleEventClick(event._id)}>
                {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="home-header-nav">
        <a href="/" title="Home">
          <FaHome className="nav-icon" />
        </a>
        <a href="/about" title="About">
          <FaInfoCircle className="nav-icon" />
        </a>
        <a href="/add-event" title="Add Event">
          <FaCalendarPlus className="nav-icon" />
        </a>
      </nav>

      {/* Authentication Links */}
      <div className="home-header-auth">
        {isLoggedIn ? (
          <>
            <span className="user-info">{user?.name || user?.email}</span>
            <span onClick={handleLogout} className="auth-link">Logout</span>
          </>
        ) : (
          <>
            <a href="/login" className="auth-link" title="Login">
              <FaSignInAlt className="nav-icon" />
            </a>
            <a href="/signup" className="auth-link" title="Sign Up">
              <FaUserPlus className="nav-icon" />
            </a>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
