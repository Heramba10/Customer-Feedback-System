// src/components/SentimentChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';

const SentimentChart = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    axios.get('/api/feedbacks/')
      .then(response => {
        setFeedbackData(response.data);
      })
      .catch(error => {
        console.error('Error fetching feedback data:', error);
      });
  }, []);

  const sentimentData = feedbackData.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [
        sentimentData['Positive'] || 0,
        sentimentData['Neutral'] || 0,
        sentimentData['Negative'] || 0,
      ],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
    }],
  };

  return (
    <div>
      <h3>Sentiment Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default SentimentChart;
