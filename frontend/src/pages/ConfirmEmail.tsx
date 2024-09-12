import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ConfirmEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:7999/api/auth/confirm/${token}`);

        if (response.ok) {
          navigate('/confirmation-success'); // Redirect to success page
        } else {
          setMessage('Invalid or expired confirmation token.');
        }
      } catch (error) {
        setMessage('Error confirming email.');
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="confirm-email-container">
      <h1>{message || 'Confirming email...'}</h1>
    </div>
  );
}

export default ConfirmEmail;
