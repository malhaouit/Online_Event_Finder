import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/ConfirmationSuccess.css";

function ConfirmationSuccess() {
  const [countdown, setCountdown] = useState(5); // 5-second countdown
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect to login page after countdown
    if (countdown === 0) {
      navigate('/login');
    }

    return () => clearInterval(timer); // Clear timer on component unmount
  }, [countdown, navigate]);

  return (
    <div className="confirmation-success-container">
      <div className="confirmation-message">
        <div className="success-icon">✔️</div> {/* You can replace with a custom icon */}
        <h1>Email Confirmed Successfully!</h1>
        <p>Your email has been successfully verified. You will be redirected to the login page in {countdown} seconds.</p>
      </div>
    </div>
  );
}

export default ConfirmationSuccess;
