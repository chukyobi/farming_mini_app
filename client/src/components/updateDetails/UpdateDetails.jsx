import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import profile_icon from '../assets/user.svg';
import './updateDetails.css';
import api from '../../api';

const UpdateDetails = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('');

  useEffect(() => {
    // Fetch user data to populate fields
    const fetchUserData = async () => {
      try {
        const response = await api.get('/updateUser');
        setUsername(response.data.username || '');
        setFirstname(response.data.firstname || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Check for required fields
    if (!username) newErrors.username = 'Username is required';
    if (!firstname) newErrors.firstname = 'First Name is required';

    // Check length constraints
    if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (firstname.length < 1) newErrors.firstname = 'First Name must be at least 1 character';

    // Check for spaces in input values
    if (/\s/.test(username)) newErrors.username = 'Username cannot contain spaces';
    if (/\s/.test(firstname)) newErrors.firstname = 'First Name cannot contain spaces';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log("Sending data:", { username, firstname }); // Debugging line
      const response = await api.post('/updateUser/updateUsername', { username, firstname });
      console.log("Response data:", response.data); // Debugging line
      const { status, userId } = response.data;

      if (status === 'userupdated') {
        // Redirect only if user details were updated successfully
        navigate(`/welcome?userId=${userId}`);
      } else {
        setErrors({ api: 'Error updating user details. Please try again.' });
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setErrors({ api: 'Error updating user details. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-[#11101C] min-h-screen p-4">
      <div className="mb-4">
        <div class="flex justify-center align-center w-16 h-16 bg-[#383A46] rounded-full">
          <img src={profile_icon} alt="Logo" className="w-8" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Update details</h2>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full">
          <label className='block mb-2 text-sm font-light'>Firstname</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="bg-transparent border border-[#383A46] text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl"
          />
          {errors.firstname && <p className="error">{errors.firstname}</p>}
        </div>

        <div className="w-full">
          <label className='block mb-2 text-sm font-light'>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-transparent border border-[#383A46] text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl"
          />
          {errors.username && <p className="error">{errors.username}</p>}
          {usernameStatus && <p className={usernameStatus === 'Username is available' ? 'good' : 'error'}>{usernameStatus}</p>}
        </div>

        {errors.api && <p className="error">{errors.api}</p>}

        <button type="submit" className="bg-[#A3FF12] text-black font-medium w-full py-2 mt-8 rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Proceed'}
        </button>
      </form>
    </div>
  );
};

export default UpdateDetails;
