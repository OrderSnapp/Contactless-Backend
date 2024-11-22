const User = require('../models/userModel');

// Handler to get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll(); // Sequelize method to get all users
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };

  // Handler to create a new user
exports.createUser = async (req, res) => {
    try {
      const newUser = await User.create(req.body); // Sequelize method to create a user
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };