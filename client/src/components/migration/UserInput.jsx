// UserInput.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const UserInput = () => {
  const [migrationCode, setMigrationCode] = useState('');
  const [response, setResponse] = useState(null);
  const [telegram, setTelegram] = useState(window.Telegram.WebApp.initDataUnsafe.user.id);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setMigrationCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      api.post('/migration', {
        migrationCode,
        telegram: telegram
      })
        .then(response => {
          const { status, userId, token } = response.data;

          if (status === 'existing_user') {
            navigate(`/welcome?userId=${userId}`);
          } else {
            setResponse(result.data);
          }
        })
        .catch(error => {
          setResponse({ message: error.response.data.error });

        });
    }
    catch (error) {
      setResponse(error);
    }
  };

  return (
    <div className='w-full px-4'>
      <div>
        <input
          type="text"
          className="bg-transparent border border-[#383A46] text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl"
          placeholder="Enter Migration Code"
          value={migrationCode}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSubmit} className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-4 rounded-lg">Submit</button>
      {response && <div>Error: {response.message}</div>}
    </div>
  );
};

export default UserInput;
