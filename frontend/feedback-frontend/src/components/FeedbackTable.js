// src/components/FeedbackTable.js
import React from 'react';

const FeedbackTable = ({ feedbacks }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Feedback Type</th>
          <th>Sentiment</th>
          <th>Tags</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((feedback) => (
          <tr key={feedback.id}>
            <td>{feedback.name}</td>
            <td>{feedback.email}</td>
            <td>{feedback.feedback_type}</td>
            <td>{feedback.sentiment}</td>
            <td>{feedback.tags}</td>
            <td>{feedback.comments}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackTable;
