import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated import for useNavigate
import "./styles/LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || "Invalid credentials");
      } else {
        // Set user data in localStorage after successful login
        console.log("User logged in:", data);
        localStorage.setItem('loggedInUser', JSON.stringify(data)); // Ensure 'data' has the user object with an 'id'
        navigate(`/home?firstname=${encodeURIComponent(data.firstName)}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  return (
    <div className="login-form">
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
  <input
    type="text"
    name="identifier"
    placeholder="Username or Email"
    onChange={handleChange}
    value={formData.identifier}
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
  <button type="submit">Login</button>
  <button
    type="button"
    onClick={() => (window.location.href = "/register")}
  >
    Register
  </button>
</form>

    </div>
  );
};

export default LoginForm;
