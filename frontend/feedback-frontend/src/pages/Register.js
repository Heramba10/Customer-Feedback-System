// src/pages/Register.js
import React, { useState } from 'react';
import "../styles/Login.css";
import "../styles/style.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: '',  // Add re_password to the state
    first_name: '',
    last_name: '',
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure both password and re_password are included in the request payload
    const data = { 
      ...userData, 
    };
    axios
      .post('http://127.0.0.1:8000/auth/register/', data)
      .then((response) => {
        alert('Registration successful!');
      })
      .catch((error) => {
        console.error('Error registering:', error);
        alert('Error registering. Please try again.');
      });
  };

  return (
    <div className="wizard-content">
      <div className="login-container"style={{ paddingTop: '82px', paddingBottom: '82px' }}>
        <div className="login-card">
          <div className="login-title">
            <h3 className="text-center text-primary">Register</h3>
          </div>
          <form onSubmit={handleSubmit} className="tab-wizard2">
            <div className="form-group row">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={userData.email}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            <div className="form-group row">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={userData.username}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            <div className="form-group row">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            <div className="form-group row">
              <input
                type="password"
                name="re_password"
                placeholder="Confirm Password"
                value={userData.re_password}
                onChange={handleChange}
                required
                className="login-input"
              />
            </div>
            
           

            <div className="row">
              <div className="col-sm-12">
                <div className="input-group mb-0">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                    style={{ width: 'inherit' }}
                  >
                    Register
                  </button>
                </div>
                <div className="font-16 weight-600 pt-10 pb-10 text-center" data-color="#707373">
                  OR
                </div>
                <div className="input-group mb-0">
                  <a
                    className="btn btn-outline-primary btn-lg btn-block"
                    href="/"
                    style={{ width: 'inherit' }}
                  >
                    Already have an account? Login
                    
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
