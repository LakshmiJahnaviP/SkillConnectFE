import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    axios.get('/api/skills')
      .then(response => {
        setSkills(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddSkill = async (skill) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skillId: skill.value }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add skill');
      }
  
      const updatedSkills = [...user.skills, { id: skill.value, name: skill.label }];
      setUser({ ...user, skills: updatedSkills });
    } catch (error) {
      setError('Error adding skill');
    }
  };
  
  const handleRemoveSkill = async (index) => {
    const skillToRemove = user.skills[index];
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}/skills/${skillToRemove.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove skill');
      }
  
      const updatedSkills = user.skills.filter((_, i) => i !== index);
      setUser({ ...user, skills: updatedSkills });
    } catch (error) {
      setError('Error removing skill');
    }
  };
  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
  };

  const handleUpdateSkill = () => {
    axios.put(`/api/skills/${editingSkill.id}`, { name: editingSkill.name })
      .then(response => {
        setSkills(skills.map(skill => skill.id === editingSkill.id ? response.data : skill));
        setEditingSkill(null);
      })
      .catch(error => {
        console.error(error);
      });
  };

  

  return (
    <div>
      <h2>Skills Manager</h2>
      <ul>
        {skills.map(skill => (
          <li key={skill.id}>
            {editingSkill && editingSkill.id === skill.id ? (
              <input type="text" value={editingSkill.name} onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })} />
            ) : (
              <span>{skill.name}</span>
            )}
            <button onClick={() => handleEditSkill(skill)}>Edit</button>
            <button onClick={() => handleRemoveSkill(skill.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} />
      <button onClick={handleAddSkill}>Add Skill</button>
      {editingSkill && (
        <button onClick={handleUpdateSkill}>Update Skill</button>
      )}
    </div>
  );
};

export default SkillsManager;