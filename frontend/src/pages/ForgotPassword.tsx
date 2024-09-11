import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:7999/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),  // Send email to backend
      });

      const data = await response.json();

      if (data.msg === 'Password reset email sent') {
        alert('Reset link sent to your email.');
	navigate('/');
      } else {
        alert('Email not found');
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      setMessage('Error: Unable to process request.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1 className="forgot-password-title">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
	className="forgot-password-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword} className="forgot-password-button">
	Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;
