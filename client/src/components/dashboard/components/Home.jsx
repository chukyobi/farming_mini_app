import React from 'react';
import Confetti from 'react-confetti';
import './dashboard_components.css';
import alpharand_coin from './assets/alpharand-coin.svg';
import leaderboard_icon from './assets/leaderboard-icon.svg';
import badge_check_icon from './assets/badge-check.svg';

const Home = ({
  userData,
  leaderboardData,
  isFarming,
  farmingProgress,
  farmedPoints,
  showClaimButton,
  showBalloons,
  startFarming,
  stopFarming,
  claimPoints,
}) => {
  const hasLeaderboardData = leaderboardData && leaderboardData.length >= 10;

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className="bg-[#11101C] text-white h-screen p-4">
      {showBalloons && (
        <>
          <Confetti />
        </>
      )}
      <div className="flex space-x-0 items-center justify-center my-16">
        <img src={alpharand_coin} alt="alpharand_coin" className="farm_coin " />
        <span className="text-5xl font-bold">{formatNumber(userData.farmedPoints)}</span>
      </div>

      <h2 className="font-bold mb-2 text-base">Leaderboard</h2>
      <div className="h-[17.5rem] overflow-scroll">
        {!hasLeaderboardData ? (
          <div className="no-records text-sm font-light">No record found!</div>
        ) : (
          leaderboardData
            .sort((a, b) => b.farmedPoints - a.farmedPoints)
            .map((profile, index) => (
              <div className="flex space-x-2 mb-2 p-4 border-[#383A46] border-[0.5px] rounded-2xl" key={index}>
                <div className="flex-none w-8">
                  <div className="flex justify-center align-center w-8 h-8 bg-[#383A46] rounded-full">
                    <img
                      src={leaderboard_icon}
                      alt="profile_image" className="w-4"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="mb-1 text-base font-medium">{profile.firstname}</p>
                  <div className="flex space-x-1 bg-[#A3FF12] py-1 px-2 rounded-md w-fit">
                    <img
                      src={badge_check_icon}
                      alt="profile_image"
                    />
                    <span className="text-xs text-black font-bold">TOP RATED</span>
                  </div>
                </div>
                
                <div className="flex-none w-24 text-end">
                  <span className="text-[#A3FF12] text-base tracking-wide">{formatNumber(profile.farmedPoints)} PTS</span>
                </div>
              </div>
            ))
        )}
      </div>

      {!isFarming && !showClaimButton && (
        <button className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-28 rounded-lg" onClick={startFarming}>
          Farm Points
        </button>
      )}
      {isFarming && (
        <button className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-28 rounded-lg" onClick={stopFarming}>
          Farming in Progress ({farmingProgress} / 15) - Click to Stop
        </button>
      )}
      {showClaimButton && (
        <div>
          <button className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-28 rounded-lg" onClick={claimPoints}>
            {formatNumber(farmedPoints)} points farmed - Claim
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
