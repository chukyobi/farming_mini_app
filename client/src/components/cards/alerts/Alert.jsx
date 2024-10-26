import React from 'react';
import './alert.css'; // You'll need to create this CSS file for styling

const Alert = ({ message, onClose }) => {
  return (
    <div className="alert-card">
      <span className="alert-message">{message}</span>
      <button className="alert-close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default Alert;
