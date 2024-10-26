import React, { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
// import useGame from '../../stores/useGame';
// import Modal from '../../components/modal/Modal';
import backgroundImage from './assets/scratch-p.png';
import help from './assets/help.svg';
import MainButton from './components/mainButton/MainButton';
import HelpButton from './components/helpButton/HelpButton';
import './scratchWin.css';

const ScratchWin = ({ userData, setCurrentPage }) => {
  //const navigate = useNavigate();

  const handlePlay = () => {
    setCurrentPage('scratch-win-play');
  };

  return (
    <div className="home-page">
      <div className="home-page-logo" style={{ backgroundImage: `url(${backgroundImage})` }} />
      {/* <img src={backgroundImage} alt="Scratch Bonaza" className="home-page-logo" /> */}

      <MainButton handleClick={handlePlay} text="PLAY" />
      <HelpButton style={{ backgroundImage: `url(${help})` }} />
      <div className="copyright">{userData.firstname} Playground</div>
    {/* {modal && <Modal />} */}
  </div>
  );
};

export default ScratchWin;
