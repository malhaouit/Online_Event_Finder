import { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleLoginButton from './GoogleLogin';
import '../styles/SignUp.css';
import SignUpHeader from '../components/SignUpHeader/SignUpHeader';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  // Add confirm password field
  // const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('All fields are required!');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:7999/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
  
      if (response.ok) {
        alert('Confirmation link sent to your email');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        alert(`Sign-up failed: ${errorData.msg || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred during sign-up.');
    }
  };  

  return (
    <>
      <SignUpHeader />
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
        <input
          type="password"
          placeholder="Confirm Password"
          className="signup-input"  // Add input for confirm password
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>

        <p className="login-prompt">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
}

export default SignUp;
