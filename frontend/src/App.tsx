import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import CreateEvent from './pages/CreateEvent';



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
          <Route path="/allEvents" element={<LandingPage />} />
          <Route path="/add-event" element={<CreateEvent />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
