import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../../api';

const Quest = ({userData, quests,userQuests}) => {
  const [claimed, setClaimed] = useState(userQuests);

  const checkQuest = (id) => {
    
    // Check if quest has been performed.
    try {
      api.get('/quest/twitter', {
        quest: id,
        user: userData.userId
      })
        .then(response => {
          const { url } = response.data;
          console.log(url);
          

          if (url.includes('api.twitter')) {
            toast("Quest Processing");
            setClaimed(prevClaimed => [...prevClaimed, id]);
            window.location.href = url;
          } else {
            toast("Internal server error");
          }
        })
        .catch(error => {
          toast("Internal server error.");

        });
    }
    catch (error) {
      console.log(error);
      toast("There was an error completing this request..");
    }
    
  };
  

  return (
    <div className="bg-[#11101C] text-white min-h-screen p-4">
      <ToastContainer />
      <div className="mt-12">
        <h1 className="text-2xl font-bold mb-4">Quests</h1>
        <div className="h-[35rem] overflow-scroll">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="flex space-x-2 mb-2 p-4 border-[#383A46] border-[0.5px] rounded-2xl"
            >
              <div className="flex-none w-8">
                <div className="flex justify-center align-center w-8 h-8 bg-[#383A46] rounded-full">
                  <img src={quest.image} alt="quest_icon" className="w-4" />
                </div>
              </div>

              <div className="flex-1">
                <p className="mb-1 text-sm">{quest.title}</p>
                <p className="font-light text-sm text-[#9493AC]">+{quest.point}pts</p>
              </div>

              <div className="flex-none w-24 text-end">
                {claimed.includes(quest.id) ? (
                  <button className="bg-[#A3FF12] text-black font-medium text-sm py-2 px-4 w-auto rounded-xl">
                    Claimed
                  </button>
                ) : (
                  <>
                    <a className='block mb-2' href={quest.link} target="_blank" rel="noopener noreferrer">
                      <button className="bg-[#A3FF12] text-black font-medium text-sm py-2 px-6 w-auto rounded-xl">
                        Start
                      </button>
                    </a>
                    <a href="#" onClick={() => checkQuest(quest.id)}>
                      <button className="bg-[#A3FF12] text-black font-medium text-sm py-2 px-[1.30rem] w-auto rounded-xl">
                        Claim
                      </button>
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quest;
