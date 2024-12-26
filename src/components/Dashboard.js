import React from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const firstname = queryParams.get("firstname");

  return (
    <div>
      {firstname ? (
        <h2>
          Hello, {firstname}! Welcome to your dashboard.
        </h2>
      ) : (
        <h2>Welcome to your dashboard.</h2>
      )}
    </div>
  );
};

export default Dashboard;
