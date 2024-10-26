import React from 'react';
import home_icon from '../assets/home.svg';
import games_icon from '../assets/puzzle.svg';
import quest_icon from '../assets/lightning-bolt.svg';
import refferal_icon from '../assets/clipboard-list.svg';
import './navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="bg-[#11101C] fixed bottom-0 inset-x-0 flex justify-around py-4 text-white">
      <div
        onClick={() => setCurrentPage('home')}
        className={`link ${currentPage === 'home' ? 'active' : ''} flex flex-col items-center`}
      >
        <img src={home_icon} alt="home_icon" />
        <p>Home</p>
      </div>
      <div
        onClick={() => setCurrentPage('play-games')}
        className={`link ${currentPage === 'play-games' ? 'active' : ''}`}
      >
        <img src={games_icon} alt="games_icon" className="nav_icon" />
        <p>Games</p>
      </div>
      <div
        onClick={() => setCurrentPage('quest')}
        className={`link ${currentPage === 'quest' ? 'active' : ''}`}
      >
        <img src={quest_icon} alt="quest_icon" className="nav_icon" />
        <p>Quests</p>
      </div>
      <div
        onClick={() => setCurrentPage('referrals')}
        className={`link ${currentPage === 'referrals' ? 'active' : ''}`}
      >
        <img src={refferal_icon} alt="referral_icon" className="nav_icon" />
        <p>Referrals</p>
      </div>
    </div>
  );
};

export default Navbar;
