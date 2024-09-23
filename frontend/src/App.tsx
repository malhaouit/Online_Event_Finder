import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ConfirmEmail from './pages/ConfirmEmail';
import ConfirmationSuccess from './pages/ConfirmationSuccess';
import LandingPage from './pages/LandingPage';
import CreateEvent from './pages/CreateEvent';
import Search from './pages/Search';
import SearchResults from './pages/SearchResults';
import EventDetail from './pages/EventDetail';
import ProfilePage from './pages/ProfilePage';
import MyEvents from './pages/MyEvents';
import UpdateEvent from './pages/UpdateEvent';
import ContactUs from './pages/ContactUs';
// import { EventsByCategory, CategoryList } from './components/EventsByCategory/EventsByCategory';

function App() {
  // Access the client ID from environment variables
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // For Vite
  // const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // For Create React App

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
	        <Route path="/confirm/:token" element={<ConfirmEmail />} />
	        <Route path="/confirmation-success" element={<ConfirmationSuccess />} />
          <Route path="/allEvents" element={<LandingPage />} />
          <Route path="/add-event" element={<CreateEvent />} />
          <Route path="/search" element={<Search />} />
          <Route path="/me" element={<MyEvents />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/update-event/:eventId" element={<UpdateEvent />} />
          <Route path="/get-in-touch" element={<ContactUs />} />
          {/* <Route path="/categories" element={<CategoryList />} />
          <Route path="/events/:category" element={<EventsByCategory />} /> */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
