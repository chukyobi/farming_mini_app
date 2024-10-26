// Chooser.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInput from './UserInput';
import default_image from '../assets/default-profile-img.svg';

const Chooser = () => {
  const [showUserInput, setShowUserInput] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const handleButtonOneClick = () => {
    navigate(`/follow-twitter?token=${token}`);
  };

  const handleButtonTwoClick = () => {
    setShowUserInput(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-[#11101C] min-h-screen p-4">
      <div className="mb-4">
        <img src={default_image} alt="default_image" className="w-12 rounded-full border-4 border-[#1F1D32]" />
      </div>
      {!showUserInput ? (
        <div>
          <button className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-4 rounded-lg" onClick={handleButtonOneClick}>New User</button>
          <button className="underline bg-transparent text-white font-medium w-full py-2 mt-4 rounded-lg" onClick={handleButtonTwoClick}>Recover Account</button>
        </div>
      ) : (
        <UserInput />
      )}
    </div>
  );
};

export default Chooser;
