import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/HomePage';
import MyProfilePage from './pages/MyProfilePage';
import Profile from './components/Profile';

const App = () => {
  
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<MyProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
