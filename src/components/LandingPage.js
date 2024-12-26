import React from 'react';
import './styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Skill Connect</h1>
      <button onClick={() => (window.location.href = '/login')}>Login</button>
      <button onClick={() => (window.location.href = '/register')}>Register</button>
    </div>
  );
};

export default LandingPage;
