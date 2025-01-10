// src/pages/Home.js
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    feedback_type: 'Complaint',
    comments: '',
  });

  const handleChange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const token = localStorage.getItem('access_token'); // Get the token from localStorage

  axios
    .post('http://127.0.0.1:8000/api/feedback/', feedback, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
    .then((response) => {
      alert('Feedback submitted successfully!');
      setFeedback({
        name: '',
        email: '',
        feedback_type: 'Complaint',
        comments: '',
      });
    })
    .catch((error) => {
      console.error('There was an error submitting feedback!', error);
      alert('Error submitting feedback. Please try again.');
    });
};


  return (
    <div className="home-container">
      <h1>Welcome to Our Feedback System</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={feedback.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={feedback.email}
          onChange={handleChange}
          required
        />
        <select
          name="feedback_type"
          value={feedback.feedback_type}
          onChange={handleChange}
          required
        >
          <option value="Complaint">Complaint</option>
          <option value="Suggestion">Suggestion</option>
          <option value="Praise">Praise</option>
        </select>
        <textarea
          name="comments"
          placeholder="Your Comments"
          value={feedback.comments}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Home;
