import React, { useState } from 'react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState([]);
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);

    const handleSkillSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSuggestedSkills(
            availableSkills.filter((skill) => skill.toLowerCase().includes(value))
        );
    };

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8080/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, skillTags: skills }),
        });
        if (response.ok) {
            alert('Post created successfully');
        }
    };

    return (
        <div>
            <h2>Create Post</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input type="text" placeholder="Search Skills" onChange={handleSkillSearch} />
            {suggestedSkills.map((skill) => (
                <div key={skill} onClick={() => setSkills([...skills, skill])}>
                    {skill}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default CreatePost;
