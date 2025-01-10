// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackTable from '../components/FeedbackTable';
import SentimentChart from '../components/SentimentChart';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('/api/feedbacks/')
      .then((response) => {
        setFeedbacks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching feedbacks:', error);
      });
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <SentimentChart />
      <FeedbackTable feedbacks={feedbacks} />
    </div>
  );
};

export default Dashboard;
