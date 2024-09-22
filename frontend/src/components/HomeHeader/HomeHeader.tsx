import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import './HomeHeader.css';
import logo from '../../assets/logo.svg'; 
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus, FaCalendarPlus, FaEdit } from 'react-icons/fa';

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

function HomeHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for profile dropdown
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const location = useLocation();
  const isOnHomePage = location.pathname === '/'; 
  const isOnEventDetailsPage = location.pathname.startsWith('/event/');

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

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen); // Toggle the dropdown

  return (
    <header className="home-header">
      {/* Logo */}
      <div className="home-header-logo">
        <a href="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </a>
      </div>

      {/* Search Bar */}
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
            {searchResults.map((event: Event) => (
              <li key={event._id} onClick={() => handleEventClick(event._id)}>
                {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="home-header-nav">
        <Link to="/" title="Home">
          <FaHome className="nav-icon" />
        </Link>
        <a href="#about-section" title="About">
          <FaInfoCircle className="nav-icon" />
        </a>

        {/* Add Event Button on Home Page */}
        {isOnHomePage && (
          <Link to="/add-event" title="Add Event">
            <FaCalendarPlus className="nav-icon" />
          </Link>
        )}

        {/* Update Button on Event Details Page */}
        {isOnEventDetailsPage && user && (
          <Link to={`/update-event/${location.pathname.split('/')[2]}`} title="Update Event">
            <FaEdit className="nav-icon" />
          </Link>
        )}
      </nav>

      {/* Authentication & Profile */}
      <div className="home-header-auth">
        {isLoggedIn ? (
          <>
            <div className="profile-container" onClick={toggleDropdown}>
              {user.profileImage ? (
                <img
                  src={`http://localhost:7999/${user.profileImage}`}
                  alt="Profile"
                  className="profile-circle"
                />
              ) : (
                <div className="profile-initial">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link to={`/profile/me`} className="dropdown-item">Profile</Link>
                <button onClick={handleLogout} className="dropdown-item">Logout</button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link" title="Login">
              <FaSignInAlt className="nav-icon" />
            </Link>
            <Link to="/signup" className="auth-link" title="Sign Up">
              <FaUserPlus className="nav-icon" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;

