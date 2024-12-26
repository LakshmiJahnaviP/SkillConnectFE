// Assuming you're using Express.js
const express = require('express');
const router = express.Router();
const User = require('./models/User'); // Import your User model or schema

// Define the route to fetch user profile by userId query parameter
router.get('/api/users/profile', (req, res) => {
  const userId = req.query.userId;  // Extract user ID from query parameter

  // Check if the userId is provided in the query string
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  // Logic to fetch the user profile from the database using the userId
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json(user);  // Respond with the user data in JSON format
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user profile.' });
    });
});

module.exports = router;
