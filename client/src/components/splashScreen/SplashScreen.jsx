import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './splashScreen.css';
import alpharand_coin from '../assets/alpharand-coin.svg';
import error_icon from '../assets/error-icon.svg';
import logo from '../assets/logo.png';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTelegramAPI = () => {
      if (typeof window.Telegram === 'undefined' || typeof window.Telegram.WebApp === 'undefined') {
        setError('Failed to load Telegram WebApp API.');
        return;
      }

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

      if (!telegramUser) {
        setError('Failed to get Telegram user data.');
        return;
      }

      api.post('/auth/telegram', {
        id: telegramUser.id,
      })
        .then(response => {
          const { status, userId, token } = response.data;

          if (status === 'existing_user') {
            navigate(`/welcome?userId=${userId}`);
          } else if (status === 'new_user') {
            // navigate(`/follow-twitter?token=${token}`);
            navigate(`/choose-action?token=${token}`);
          }
        })
        .catch(error => {
          setError('Error authenticating with Telegram. Please try again.');
        });
    };

    const timer = setTimeout(checkTelegramAPI, 4000); // Splash screen lasts for 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      {error ? (
        <div className="flex flex-col items-center justify-center h-screen text-white bg-[#11101C] min-h-screen p-4">
          <div className="mb-12">
            <div className="flex justify-center align-center w-16 h-16 bg-[#383A46] rounded-full">
              <img src={error_icon} alt="Logo" className="w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-center mb-2 font-light text-sm">{error}</p>
        </div>
      ) : (
        <div className="splash-screen">
          <img src={alpharand_coin} alt="alpharand_coin" className="splash_coin " />
          <img src={logo} alt="alpharand_logo" className="w-36" />
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
