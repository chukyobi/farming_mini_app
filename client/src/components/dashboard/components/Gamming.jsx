import React from 'react';
import Slider from 'react-slick';
import scratch_image from "./assets/scratch-bonanza-game-graphic.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './dashboard_components.css';

const Gaming = ({ userData, setCurrentPage }) => {

  const handlePlayClick = () => {
    setCurrentPage('scratch-win');
  };

  const gameLayouts = [
    {
      id: 1,
      title: 'Scratch & Win',
      subtitle: 'Crazy Art Games',
      img: scratch_image
    },
    // Add more game layouts as needed
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: dots => (
      <div style={{ bottom: '-25px' }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    )
  };

  return (
    <div className='bg-[#11101C] text-white min-h-screen p-4'>
      <div className="mt-12">
        <h2 className='text-2xl font-bold mb-4'>Gaming</h2>
        {gameLayouts.length > 1 ? (
          <Slider {...settings}>
            {gameLayouts.map(game => (
              <div className='relative rounded-2xl h-[300px]' key={game.id}>
                <img src={game.img} alt="game_image" className="absolute rounded-2xl block w-full h-[300px]" />
                <div className='absolute bottom-0 w-full flex space-x-2 p-4 bg-[#BF0036]/30 backdrop-blur-sm rounded-2xl'>
                  <div className='flex-1'>
                    <p className="mb-1 text-base font-bold">{game.title}</p>
                    <p className='font-light text-sm'>{game.subtitle}</p>
                  </div>
                  <div class="flex-none w-24">
                    <button className='bg-[#A3FF12] text-black font-medium text-sm py-4 px-8 w-full rounded-xl' onClick={handlePlayClick}>Play</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className='relative rounded-2xl h-[300px]' key={gameLayouts[0].id}>
            <img src={gameLayouts[0].img} alt="game_image" className="absolute rounded-2xl block w-full h-[300px]" />
            <div className='absolute bottom-0 w-full flex space-x-2 p-4 bg-[#BF0036]/30 backdrop-blur-sm rounded-2xl'>
              <div className='flex-1'>
                <p className="mb-1 text-base font-bold">{gameLayouts[0].title}</p>
                <p className='font-light text-sm'>{gameLayouts[0].subtitle}</p>
              </div>
              <div class="flex-none w-24">
                <button className='bg-[#A3FF12] text-black font-medium text-sm py-4 px-8 w-full rounded-xl' onClick={handlePlayClick}>Play</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gaming;
