const UserService = require('../services/userService');
// Handler to get all users
const getAllUsers = async (req, res) => {
    return UserService.getAllUsers({req, res});
};

  // Handler to create a new user
const createUser = async (req, res) => {
    return UserService.createUser({req, res});
};

const getUser = async (req, res) => {
    return UserService.getUserById({req, res});
}

const updateUser = async (req, res) => {
    return UserService.updateUserById({req, res});
}

const deleteUser = async (req, res) => {
    return UserService.deleteUserById({req, res});
}

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
};