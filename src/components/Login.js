import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>🏢</div>
          <h1 style={styles.title}>Employee Portal</h1>
        </div>
        
        <h2 style={styles.subtitle}>Welcome Back!</h2>
        <p style={styles.description}>Please sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            style={isLoading ? {...styles.button, ...styles.buttonLoading} : styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            © 2024 Employee Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    color: '#1a365d',
    margin: '0',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '20px',
    color: '#2d3748',
    marginBottom: '8px',
    textAlign: 'center',
  },
  description: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    color: '#4a5568',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    ':focus': {
      borderColor: '#3182ce',
    },
  },
  button: {
    padding: '12px',
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginTop: '8px',
    ':hover': {
      backgroundColor: '#2c5282',
    },
  },
  buttonLoading: {
    backgroundColor: '#90cdf4',
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: '#a0aec0',
  },
};

export default Login;