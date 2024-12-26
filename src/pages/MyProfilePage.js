import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Select from 'react-select';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import '../components/styles/ProfilePage.css';

const MyProfilePage = () => {

  const [user, setUser] = useState({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    skills: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]); // Available skills for suggestions
  const [selectedSkills, setSelectedSkills] = useState([]); // Current user's skills

  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();

  useEffect(() => {
    // Extract 'userId' from the URL query string
    const params = new URLSearchParams(location.search);
    const userId = params.get('id');
  
    if (!userId) {
      setError('User ID is missing');
      return;
    }
  
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/profile?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
  
        const data = await response.json();
        setUser(data);
  
        // Map skills to the format needed for `selectedSkills`
        setSelectedSkills(
          data.skills.map(skill => ({
            value: skill.id,
            label: skill.name,
          }))
        );
      } catch (error) {
        setError(error.message);
      }
    };
  
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/skills', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
  
        const data = await response.json();
        setSkills(
          data.map(skill => ({
            value: skill.id,
            label: skill.name,
          }))
        );
      } catch (error) {
        setError('Error fetching skills');
      }
    };
  
    fetchUserProfile();
    fetchSkills();
  }, [location.search]);
  

  const handleSkillChange = (selectedOption) => {
    if (selectedOption) {
      // Add the selected option if it’s not already in the list
      setSelectedSkills(prevSkills => {
        if (!prevSkills.some(skill => skill.value === selectedOption.value)) {
          return [...prevSkills, selectedOption];
        }
        return prevSkills; // Prevent duplicates
      });
    }
  };
  
  

  const handleSaveChanges = async () => {
    try {
      const userId = user.id;
  
      const response = await fetch(`http://localhost:8080/api/users/profile?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          skills: selectedSkills.map(skill => ({
            id: skill.value,
            name: skill.label,
          })), // Ensure skills are formatted correctly
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const updatedUser = await response.json();
  
      // Update the local state
      setUser(updatedUser);
      setSelectedSkills(
        updatedUser.skills.map(skill => ({
          value: skill.id,
          label: skill.name,
        }))
      );
  
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Error saving changes');
    }
  };
  
  
  const renderSkillTags = () => (
    <div className="skill-tags">
      {selectedSkills.map(skill => (
        <span key={skill.value} className="skill-tag">
          {skill.label}
          <button
            type="button"
            className="remove-skill-button"
            onClick={() =>
              setSelectedSkills(prevSkills => prevSkills.filter(s => s.value !== skill.value))
            }
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
  

  
  
  const handleAddSkill = async (skill) => {
    if (user.skills.includes(skill)) {
      setError('This skill is already added');
      return;
    }
    setUser({ ...user, skills: [...user.skills, skill] });
    setNewSkill('');
  };

  const handleRemoveSkill = async (index) => {
    const skillToRemove = user.skills[index];
    try {
      setSelectedSkills((prevSkills) =>
        prevSkills.filter((skill) => skill.value !== skillToRemove.value)
      );
    } catch (error) {
      setError('Error removing skill');
    }
  };

 

  const skillsManager = (
    <div className="skills-manager">
      <h3>Skills Manager</h3>
      <Select
        isMulti
        options={skills}
        value={selectedSkills}
        onChange={handleSkillChange}
        placeholder="Select or search skills..."
      />
      <button onClick={handleAddSkill} className="add-skill-button">
        Add Skill
      </button>
      <ul>
        {user.skills.map((skill, index) => (
          <li key={skill.id}>
            {skill.name}
            <button onClick={() => handleRemoveSkill(index)} className="remove-skill-button">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Profile form for displaying and editing */}
        <div className="profile-form">
          <div className="profile-field">
            <div className="profile-label">Username</div>
            <div className="profile-value">
              {isEditing ? (
                <input
                  type="text"
                  value={user.username}
                  onChange={e => setUser({ ...user, username: e.target.value })}
                />
              ) : (
                user.username || 'N/A'
              )}
            </div>
          </div>

          <div className="profile-field">
            <div className="profile-label">First Name</div>
            <div className="profile-value">
              {isEditing ? (
                <input
                  type="text"
                  value={user.firstName}
                  onChange={e => setUser({ ...user, firstName: e.target.value })}
                />
              ) : (
                user.firstName || 'N/A'
              )}
            </div>
          </div>

          <div className="profile-field">
            <div className="profile-label">Last Name</div>
            <div className="profile-value">
              {isEditing ? (
                <input
                  type="text"
                  value={user.lastName}
                  onChange={e => setUser({ ...user, lastName: e.target.value })}
                />
              ) : (
                user.lastName || 'N/A'
              )}
            </div>
          </div>

          <div className="profile-field">
            <div className="profile-label">Email</div>
            <div className="profile-value">
              {isEditing ? (
                <input
                  type="email"
                  value={user.email}
                  onChange={e => setUser({ ...user, email: e.target.value })}
                />
              ) : (
                user.email || 'N/A'
              )}
            </div>
          </div>

          <div className="profile-field">
          <label className="profile-label">Skills</label>
          {isEditing ? (
            <>
              <Select
                
                options={skills} 
                onChange={handleSkillChange} 
                placeholder="Search and add skills..."
                isClearable
                value={null} 
              />
              
              {renderSkillTags()}
            </>
          ) : (
            <div className="skills-display">
              {user.skills.map(skill => (
                <span key={skill.id} className="skill-badge">
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
    
          {isEditing && (
            <button onClick={handleSaveChanges} className="save-changes-button">
              Save Changes
            </button>
          )}
        </div>
        

        {!isEditing && (
          <button
            onClick={() => setIsChangePasswordVisible(!isChangePasswordVisible)}
            className="change-password-button"
          >
            Change Password
          </button>
        )}

        {isChangePasswordVisible && (
          <div className="password-change-section">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword} className="change-password-submit">
              Change Password
            </button>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          
        )}
      </div>
    </div>
    
  );
};

export default MyProfilePage;