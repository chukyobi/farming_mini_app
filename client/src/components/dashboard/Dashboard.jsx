import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import Header from '../header/Header';
import Home from './components/Home';
import Quest from './components/Quest';
import Gamming from './components/Gamming';
import Referrals from './components/Referrals';
import ScratchWin from './games/scratchwin/ScratchWin';
import ScratchwinPlay from './games/scratchwin/ScratchWinPlay';
import Alert from '../cards/alerts/Alert'; // Import the Alert component
import api from '../../api';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Set default page to 'home'
  const [userData, setUserData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState('');
  const [isFarming, setIsFarming] = useState(false);
  const [farmingProgress, setFarmingProgress] = useState(0);
  const [farmedPoints, setFarmedPoints] = useState(0);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [quests, setQuests] = useState([]);
  const [userQuests, setUserQuests] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const userId = query.get('userId');

        if (!userId) {
          setError('User ID not found');
          return;
        }

        const response = await api.get(`/dashboard?userId=${userId}`);
        setUserData(response.data.userData);
        setLeaderboardData(response.data.leaderboardData);
        setQuests(response.data.quests);
        setUserQuests(response.data.user_quests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error fetching dashboard data. Please try again.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedPoints = localStorage.getItem('unclaimedPoints');
    if (storedPoints) {
      setFarmedPoints(parseInt(storedPoints, 10));
      setShowClaimButton(true);
    }

    let interval;

    if (isFarming) {
      interval = setInterval(() => {
        setFarmingProgress((prev) => {
          // Check if 7 hours (420 minutes) have passed
          if (prev < 420) {
            setFarmedPoints((prevPoints) => {
              const newPoints = prevPoints + 450;
              localStorage.setItem('unclaimedPoints', newPoints.toString());
              return newPoints;
            });
            return prev + 60; // Increment progress by 60 minutes (i.e., 1 hour)
          } else {
            clearInterval(interval);
            setShowClaimButton(true);
            setIsFarming(false);
            return prev;
          }
        });
      }, 3600000); // 1 hour in milliseconds (3600000 ms)
    }

    // Cleanup function to clear the interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isFarming]);

  const startFarming = () => {
    setIsFarming(true);
    setFarmingProgress(0);
    setFarmedPoints(0);
    setShowClaimButton(false);
  };

  const stopFarming = () => {
    setIsFarming(false);
    setShowClaimButton(true);
  };

  const claimPoints = async () => {
    try {
      await api.post('/dashboard/claim-points', {
        userId: userData?.userId,
        points: farmedPoints,
      });
      setAlertMessage('Points claimed successfully!'); // Show success message in alert card
      localStorage.removeItem('unclaimedPoints');
      setShowClaimButton(false);
      setShowBalloons(true);
      setTimeout(() => {
        setShowBalloons(false);
        window.location.reload(); // Refresh the page
      }, 6000); // Show confetti or balloons effect for 6 seconds
    } catch (error) {
      console.error('Error claiming points:', error);
      setAlertMessage('Failed to claim points. Please try again.'); // Show error message in alert card
    }
  };

  const handleAlertClose = () => {
    setAlertMessage('');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            userData={userData}
            leaderboardData={leaderboardData}
            isFarming={isFarming}
            farmingProgress={farmingProgress}
            farmedPoints={farmedPoints}
            showClaimButton={showClaimButton}
            showBalloons={showBalloons}
            startFarming={startFarming}
            stopFarming={stopFarming}
            claimPoints={claimPoints}
          />
        );
      case 'quest':
        return (
          <Quest
            userData={userData}
            quests={quests}
            userQuests={userQuests}
          />
        );
      case 'play-games':
        return <Gamming userData={userData} setCurrentPage={setCurrentPage} />;
      case 'referrals':
        return <Referrals userData={userData} />;
      case 'scratch-win':
        return <ScratchWin userData={userData} setCurrentPage={setCurrentPage} />;
      case 'scratch-win-play':
        return <ScratchwinPlay userData={userData} />;
      default:
        return (
          <Home
            userData={userData}
            leaderboardData={leaderboardData}
            isFarming={isFarming}
            farmingProgress={farmingProgress}
            farmedPoints={farmedPoints}
            showClaimButton={showClaimButton}
            showBalloons={showBalloons}
            startFarming={startFarming}
            stopFarming={stopFarming}
            claimPoints={claimPoints}
          />
        );
    }
  };

  if (error) {
    return <div className="error-container"><p>{error}</p></div>;
  }

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Header userData={userData} setUserData={setUserData} />
      {renderPage()}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {alertMessage && (
        <Alert message={alertMessage} onClose={handleAlertClose} />
      )}
    </>
  );
};

export default Dashboard;
