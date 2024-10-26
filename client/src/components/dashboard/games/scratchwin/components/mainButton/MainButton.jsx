import React from 'react';
import './style.css';

const MainButton = ({ handleClick, text, disabled }) => {
  return (
    <div
      onClick={!disabled ? handleClick : undefined}
      className={`button-main ${disabled ? 'disabled-button' : ''}`}
    >
      {text}
    </div>
  );
};

export default MainButton;
