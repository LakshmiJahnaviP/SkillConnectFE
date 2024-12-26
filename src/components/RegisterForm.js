import React, { useState } from 'react';
import './styles/RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user'  // Set default role as 'user'
  });
  
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;  // Don't submit if passwords don't match
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {  // URL to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Registration failed');
      } else {
        alert('Registration successful');
        window.location.href = '/login';  // Redirect to login page
      }
    } catch (error) {
      setErrorMessage('Failed to register. Please try again later.');
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          value={formData.username} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          value={formData.email} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          value={formData.password} 
          required 
        />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          onChange={handleChange} 
          value={formData.confirmPassword} 
          required 
        />
        <input 
          type="text" 
          name="firstName" 
          placeholder="First Name" 
          onChange={handleChange} 
          value={formData.firstName} 
          required 
        />
        <input 
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          onChange={handleChange} 
          value={formData.lastName} 
          required 
        />
        {/* Optional Role field - hidden from the user, set default value */}
        <input 
          type="hidden" 
          name="role" 
          value={formData.role} 
        />
        <button 
          type="submit" 
          disabled={!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName}
        >
          Register
        </button>
        <button type="button" onClick={() => (window.location.href = '/')}>Cancel</button>
        <p><a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default RegisterForm;
