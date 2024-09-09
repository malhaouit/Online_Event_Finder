import { Link, useNavigate } from 'react-router-dom';
import './HomeHeader.css'; // Import the styles for the HomeHeader
import logo from '../../assets/logo.svg'; // Import your logo file
import searchIcon from '../../assets/search-icon.svg';

function HomeHeader() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <header className="home-header">
      {/* Logo image */}
      <div className="home-header-logo">
        <Link to="/">
          <img src={logo} alt="Online Event Finder" className="header-logo-img" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="home-header-search">
	<img src={searchIcon} alt="Search Icon" className="search-icon" />
        <input
          type="text"
          placeholder="Search events, profiles..."
          className="search-input"
        />
      </div>

      {/* Navigation Links */}
      <nav className="home-header-nav">
        <Link to="/add-event">Add Event</Link>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Authentication Links */}
      <div className="home-header-auth">
        {isLoggedIn ? (
          <span onClick={handleLogout} className="auth-link">Logout</span>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
