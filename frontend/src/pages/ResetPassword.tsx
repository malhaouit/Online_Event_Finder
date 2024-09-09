import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css';

function ResetPassword() {
  const { token } = useParams();  // Extract token from the URL
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),  // Send token and new password to backend
      });

      const data = await response.json();
      if (response.ok) {
	alert('Password reset successfully!');
        navigate('/login');  // Redirect to login after successful reset
      } else {
	alert('Invalid or expired token.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Invalid or expired token.');
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-password-title">Reset Password</h1>
      <input
        type="password"
        placeholder="Enter new password"
	className="reset-password-input"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword} className="reset-password-button">
	Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;
