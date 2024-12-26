import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const Profile = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    // Fetch available skills from the backend
    axios.get('/api/skills')
      .then(response => {
        const skillOptions = response.data.map(skill => ({
          value: skill.id,
          label: skill.name,
        }));
        setSkills(skillOptions);
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });

    // Fetch user's current skills
    axios.get('/api/users/{userId}/skills')
      .then(response => {
        const userSkills = response.data.map(skill => ({
          value: skill.id,
          label: skill.name,
        }));
        setSelectedSkills(userSkills);
      })
      .catch(error => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Server Error:', error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('Network Error:', error.request);
        } else {
          // Something else happened
          console.error('Error:', error.message);
        }
      });
  }, []);

  

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const handleSaveChanges = () => {
    const skillIds = selectedSkills.map(skill => skill.value);
    axios.post('/api/users/{userId}/skills', skillIds)
      .then(response => {
        alert('Skills updated successfully.');
      })
      .catch(error => {
        console.error('Error updating skills:', error);
      });
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <label>Skills:</label>
      <Select
        isMulti
        options={skills}
        value={selectedSkills}
        onChange={handleSkillChange}
        placeholder="Select or search skills..."
      />
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default Profile;
