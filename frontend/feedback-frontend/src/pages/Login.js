import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Assuming you've created an Axios instance

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if tokens are already available in localStorage
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken) {
      // Check if access token is expired
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1])); // Decode the JWT to get expiration time
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

      if (decodedToken.exp < currentTime) {
        // Token is expired, try refreshing it
        api
          .post('auth/token/refresh/', { refresh: refreshToken })
          .then((response) => {
            const { access } = response.data;
            localStorage.setItem('access_token', access); // Store new access token
            alert('Access token refreshed!');
          })
          .catch((error) => {
            console.error('Error refreshing token:', error);
            alert('Session expired. Please log in again.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login'; // Optionally redirect to login
          });
      }
    }
  }, []); // Empty array means this effect will run only once when the component mounts

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('http://127.0.0.1:8000/auth/login/', credentials)
      .then((response) => {
        const { access, refresh, user } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        alert('Login successful!');
          if (user.is_staff) {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Handle refresh token error
          const refreshToken = localStorage.getItem('refresh_token');

          api
            .post('auth/token/refresh/', { refresh: refreshToken })
            .then((response) => {
              const { access } = response.data;
              localStorage.setItem('access_token', access);
              
            })
            .catch((refreshError) => {
              console.error('Error refreshing token:', refreshError);
              alert('Session expired. Please log in again.');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login'; // Optionally redirect to login
            });
        } else {
          console.error('Error logging in:', error);
          alert(error.response?.data?.detail || 'Error logging in');
        }
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;


 