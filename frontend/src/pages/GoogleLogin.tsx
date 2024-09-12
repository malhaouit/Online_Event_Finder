import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate(); // Hook to handle navigation

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      // Send the idToken to your backend
      const res = await axios.post('http://localhost:7999/api/auth/google', { idToken });

      if (res.status === 200) {
        const { token, user } = res.data;
        
        // Store the token and user data with the correct key
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Login successful');
        navigate('/allEvents'); // Redirect to the home page after successful login
      } else {
        console.error('Login failed:', res.data.msg);
      }
    } catch (error) {
      console.error('Error sending idToken to backend:', error);
    }
  };

  const handleGoogleLoginFailure = (error: any) => {
    console.error('Google login failed:', error);
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginFailure}
    />
  );
};

export default GoogleLoginButton;
