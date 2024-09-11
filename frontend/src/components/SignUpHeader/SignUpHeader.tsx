import {Link} from 'react-router-dom';
import './SignUpHeader.css'; // Import the styles for the LoginHeader
import logo from '../../assets/logo.svg'; // Import your logo file
import searchIcon from '../../assets/search-icon.svg';
import { FaHome, FaSignInAlt} from 'react-icons/fa'; // Import only the required icons

function LoginHeader() {
  

  return (
    <header className="login-header">
      {/* Logo image */}
      <div className="login-header-logo">
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
      <div className='Icons-LoginHeader'> 
      <nav className="login-header-nav">
        <Link to="/">
          <div className="nav-icon-text">
            <FaHome />
          </div>
        </Link>
       
      </nav>

      {/* Authentication Link */}
      <div className="login-header-auth">
      <Link to="/login" className="auth-link">
              <div className="nav-icon-text">
                <FaSignInAlt />
              </div>
            </Link>
      </div>
      </div>
    </header>
  );
}

export default LoginHeader;
