import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import default_image from '../assets/default-profile-img.svg';
import alpharand_coin from '../assets/alpharand-coin.svg';
import error_icon from '../assets/error-icon.svg';
import './welcomeUser.css';
import api from '../../api';
import SplashScreen from '../splashScreen/SplashScreen';

const Welcome = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [unclaimedPoints, setUnclaimedPoints] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const userId = query.get('userId');

        if (!userId) {
          setError('User ID not found');
          return;
        }

        const response = await api.get(`/welcome?userId=${userId}`);

        setUserData(response.data.userData);

        // Determine if the user is new or existing
        setIsNewUser(response.data.isNewUser);

        // Check for unclaimed points in local storage for existing users
        if (!response.data.isNewUser) {
          const storedPoints = localStorage.getItem("unclaimedPoints");
          if (storedPoints) {
            setUnclaimedPoints(parseInt(storedPoints, 10));
          }
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          setError(401);
        } else {
          setError('Error fetching user info. Please try again.');
        }
      }
    };

    fetchUserData();
  }, [location.search]);

  const handleContinue = () => {
    if (userData) {
      navigate(`/dashboard?userId=${userData.userId}`);
    }
  };

  if (error) {
    if (error == 401) {
      return <SplashScreen />
    }
    else {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white bg-[#11101C] min-h-screen p-4">
          <div className="mb-12">
            <div className="flex justify-center align-center w-16 h-16 bg-[#383A46] rounded-full">
              <img src={error_icon} alt="Logo" className="w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-center mb-2 font-light text-sm">{error}</p>
        </div>
      );
    }
  }

  if (!userData) {
    return (
      <div className="splash-screen">
        <img src={alpharand_coin} alt="alpharand_coin" className="splash_coin " />
        <span className='splash_text'>Alpharand</span>
      </div>
    );
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-[#11101C] min-h-screen p-4 fade-in">
      <div className="mb-8">
        <img src={default_image} alt="default_image" className="w-16 rounded-full border-4 border-[#1F1D32]" />
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Welcome,{isNewUser ? '' : ' '}
        <span style={{ color: '#A3FF12' }}>@{userData.username}</span>
      </h2>
      {isNewUser ? (
        <div className="my-12">
          <span className="text-center mb-2 font-light text-sm tracking-wide">You've just received</span>
          <div className="flex space-x-0 items-center justify-center my-3">
            <img src={alpharand_coin} alt="default_image" className="welcome_logo_" />
            <span className="text-5xl font-bold">{formatNumber(userData.farmedPoints)}</span>
          </div>
          <span className="text-center mb-2 font-light text-sm tracking-wide">AlphaRand points</span>
        </div>
      ) : (
        unclaimedPoints > 0 ? (
          <div className="my-12">
            <span className="text-center mb-2 font-light text-sm tracking-wide">You have unclaimed</span>
            <div className="flex space-x-0 items-center justify-center my-3">
              <img src={alpharand_coin} alt="default_image" className="welcome_logo_" />
              <span className="text-5xl font-bold">{formatNumber(unclaimedPoints)}</span>
            </div>
            <span className="text-center mb-2 font-light text-sm tracking-wide">AlphaRand points</span>
          </div>
        ) : (
          <div className="my-12">
            <span className="text-center mb-2 font-light text-sm tracking-wide">You have a total of</span>
            <div className="flex space-x-0 items-center justify-center my-3">
              <img src={alpharand_coin} alt="default_image" className="welcome_logo_" />
              <span className="text-5xl font-bold">{formatNumber(userData.farmedPoints)}</span>
            </div>
            <span className="text-center mb-2 font-light text-sm tracking-wide">AlphaRand points</span>
          </div>
        )
      )}
      <button className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-4 rounded-lg" onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default Welcome;
