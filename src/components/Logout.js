import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear JWT token from cookies
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Clear the auth_token cookie

    // Redirect to landing page (login/register page)
    alert("You have logged out!");
    navigate('/'); // Redirect to the landing page (login/register page)
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
