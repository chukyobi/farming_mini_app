import './style.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useGame from '../stores/useGame';
import { getLocalStorage, setLocalStorage } from '../stores/utils';
import Card from './components/scratchCard/ScratchCard';
import Modal from './components/modal/Modal';
import MainButton from './components/mainButton/MainButton';
import HelpButton from './components/helpButton/HelpButton';
import CryptoJS from 'crypto-js';

/**
 * Sound
 */
const magicSound = new Audio('./sounds/magic.mp3');
magicSound.volume = 0.2;

type CardRefType = {
  resetScratchCards: () => void;
};

export const ScratchWinPlay = () => {
  const navigate = useNavigate();
  const {
    valuesUrl,
    modal,
    revealed,
    resetRevealed,
    start,
    end,
    coins,
    cards,
    addCard,
  } = useGame();
  const [scratchCard, setScratchCard] = useState<(0 | 1 | 10 | 100 | 1000)[] | undefined>();
  const [key, setKey] = useState(0);
  const cardRef = useRef<CardRefType>(null);

  useEffect(() => {
    start();
    resetRevealed();
    fetchScratchCard();
  }, []);

  useEffect(() => {
    if (revealed === 4) {
      updatePoints()
      end();
    }
    
  }, [revealed]);

  const fetchScratchCard = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      
      const response = await fetch(valuesUrl, requestOptions);
      if (response.ok) {
        const data = await response.json();
        setScratchCard(data);
      } else {
        console.error('Failed to fetch scratch card: ', response.status);
      }
    } catch (error) {
      console.error('Error while fetching scratch card: ', error);
    }
  };


  const updatePoints = async () => {
    try {
      const sumValues = (arr: (0 | 1 | 10 | 100 | 1000)[] | undefined): number => {
        if (!arr) {
          return 0;
        }
      
        return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      };
      const secretKey = '48396a3831177b6d9d095d93';
      const encryptData = (data: string) => {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
      };
      const searchParams = new URLSearchParams(window.location.search);
      const userId = searchParams.get('userId');
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           x: encryptData(sumValues(scratchCard).toString()),
           y: encryptData(userId??'')
          })
      };
      
      const response = await fetch(valuesUrl, requestOptions);
      if (response.ok) {
        const data = await response.json();
        
      } else {
        console.error('Call failed: ', response.status);
      }
    } catch (error) {
      console.error('Call failed: ', error);
    }
  };

  const resetAllScratchCards = () => {
    if (cardRef.current) {
      cardRef.current.resetScratchCards();
    }
  };

  /**
   * Storage and state initiation
   */
  useEffect(() => {
    const storedCoins = getLocalStorage('coins');
    if (storedCoins === null) {
      setLocalStorage('coins', '0');
    }

    const storedCards = getLocalStorage('cards');
    if (storedCards === null) {
      setLocalStorage('cards', '0');
    }
    addCard();
  }, []);

  /**
   * Button event handling
   */
  const handleNew = async () => {
    
    magicSound.currentTime = 0;
    magicSound.play();
    start();
    addCard();
    resetRevealed();
    resetAllScratchCards();
    fetchScratchCard();
    setKey((prevKey) => prevKey + 1); // Update the key to trigger component refresh
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="play-page">
      {!scratchCard ? (
        <div className="loading">LOADING...</div>
      ) : (
        <>
          {/* <img
            src="../assets/alpharand.png"
            className="logo-small"
            onClick={handleBack}
            alt="Logo"
            width={50}
            height={50}
          /> */}
          <Card key={key} ref={cardRef} card={scratchCard} />

          <MainButton
            handleClick={handleNew}
            text="NEW"
            disabled={revealed !== 4}
          />

          <HelpButton />
          {modal && <Modal />}

          <div className="stats">
            <div>CARDS : {cards}</div>
            <div>
              <img className="inline-block mb-1 w-8" src="./assets/alpharand-coin.svg" alt="Coin" /> <span className="inline">{coins}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScratchWinPlay;
