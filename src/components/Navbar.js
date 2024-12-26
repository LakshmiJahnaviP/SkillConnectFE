import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (loggedInUser && loggedInUser.user && loggedInUser.user.id) {
        const response = await fetch(`http://localhost:8080/api/notifications?userId=${loggedInUser.user.id}`);
        const data = await response.json();
        if (!Array.isArray(data)) {
          data = [data]; 
        }
        console.log("API Response:", data); 
        setNotifications(data);
        setUnreadCount(data.filter((notification) => !notification.read).length); 
      }
    };
  
    fetchNotifications();
  }, []);
  
  

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setUserId(null);
    navigate('/');
  };

  // Navigate between Home and Profile pages
  const handleNavigation = () => {
    if (location.pathname === '/home') {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (loggedInUser && loggedInUser.user && loggedInUser.user.id) {
        navigate(`/profile?id=${loggedInUser.user.id}`);
      } else {
        console.error("User ID not found in localStorage.");
      }
    } else if (location.pathname.startsWith('/profile')) {
      navigate('/home');
    }
  };

  const markNotificationsAsRead = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.user && loggedInUser.user.id) {
      await fetch(`http://localhost:8080/api/notifications/mark-read?userId=${loggedInUser.user.id}`, {
        method: "POST",
      });
  
      // Update state to reflect changes
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0); // Reset unread count
    }
  };
  

  // Toggle Notifications Dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead(); // Mark notifications as read when opening the dropdown
    }
  };
  
  

  // Close notifications dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <button onClick={handleNavigation}>
          {location.pathname === '/home' ? 'My Profile' : 'Home'}
        </button>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <h1>Skill Connect</h1>
        <p className="caption">Connecting People</p>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
      <div className="notifications-container">
  <button className="notifications-icon" onClick={toggleNotifications}>
    🛎️
    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
  </button>
  {showNotifications && (
    <div className="notifications-dropdown">
      <h4>Notifications</h4>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className={`notification-item ${notification.read ? '' : 'unread'}`}>
            {notification.message}
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  )}
</div>


        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
