"use client"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import "../styles/style.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';

import api from '../api/api';
// Assuming you've created an Axios instance

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
            window.location.href = '/'; // Optionally redirect to login
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
              window.location.href = '/'; // Optionally redirect to login
            });
        } else {
          console.error('Error logging in:', error);
          alert(error.response?.data?.detail || 'Error logging in');
        }
      });
  };

  return (
   <div className="wizard-content">
    <div className="login-container">
        <div className="login-card">
          <div className="login-title">
            <h3 className='text-center text-primary'>Login</h3>
          </div>
          <form onSubmit={handleSubmit} className="tab-wizard2">
            <div className="form-group row">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="login-input"
              />
            </div>
          <div className="form-group row">
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="login-input"
              />
            </div>
          		<div className="row">
								<div className="col-sm-12">
									<div className="input-group mb-0">
										
										
										<button type="submit" className="btn btn-primary btn-lg btn-block" style={{width: 'inherit'}}>Submit</button>
										
				
									</div>
									<div className="font-16 weight-600 pt-10 pb-10 text-center" data-color="#707373">OR</div>
									<div className="input-group mb-0">
										<a className="btn btn-outline-primary btn-lg btn-block" href="/register" style={{ width: 'inherit'}}>Register To Create Account</a>
									</div>
              </div>
              </div>
        </form>
      </div>
      </div>
      </div>
  );
};

export default Login;


 