const UserService = require('../services/userService');
// Handler to get all users
exports.getAllUsers = async (req, res) => {
    return UserService.getAllUsers(req, res);
};

  // Handler to create a new user
exports.createUser = async (req, res) => {
    
};