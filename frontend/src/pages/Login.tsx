import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Store token in localStorage after successful login
        localStorage.setItem('token', data.token);

        // Redirect to the home page
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      <input
        type="email"
        placeholder="Email"
	className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
	className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="login-button">Log in</button>
      
      <p className="forgot-password">
	<Link to="/forgot-password">Forgot Password?</Link>
      </p>

      <p className="signup-prompt">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
