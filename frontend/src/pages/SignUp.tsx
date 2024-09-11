import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLogin';
import '../styles/SignUp.css';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const response = await fetch('http://localhost:7999/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.token) {
      // Handle successful sign-up, e.g., store token
      console.log('Sign-up successful');
      navigate('/login');  // Redirect to login page after sign-up
    } else {
      alert('Sign-up failed');
    }
  };

  return (
    <div className="signup-container">
      <GoogleLoginButton />
      <h1 className="signup-title">Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
	className="signup-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
	className="signup-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
	className="signup-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp} className="signup-button">
	Sign Up
      </button>

      <p className="login-prompt">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignUp;
