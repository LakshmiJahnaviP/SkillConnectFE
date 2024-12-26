import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure new password and confirmation match
    if (newPassword !== newPasswordConfirm) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    const passwordChangeRequest = {
      oldPassword,
      newPassword,
      newPasswordConfirm,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/change-password?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordChangeRequest),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Password change failed");
      } else {
        alert("Password changed successfully!");
        navigate("/profile"); // Redirect to profile page after successful password change
      }
    } catch (error) {
      setErrorMessage("Failed to change password. Please try again later.");
      console.error("Error during password change:", error);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
