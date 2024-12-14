const User = require('../models/userModel');
const apiResponse = require('../utils/apiResponse');

const getAllUsers = async ({res}) => {
    try{
        const users = await User.findAll();

        if (!users) {
            return apiResponse(res, 404, 'Users not found');
        }

        return apiResponse(res, 200, 'Users retrieved successfully', users);
    }catch(err){
        return apiResponse(res, 400, err.message);
    }
}
const createUser = async ({res, username, email, password, phone}) => {
    try{
        const user = await User.create({ username, email, password, phone });
        return apiResponse(res, 201, 'User created successfully', user);
    }catch(err){
        return apiResponse(res, 400, err.message);
    }
}
const getUserById = async ({res,id}) => {
    const user = await User.findByPk(id);
    if (!user) {
        return apiResponse(res, 404, 'User not found');
    }
    return apiResponse(res, 200, 'User retrieved successfully', user);
}

const updateUserById = async ({res,id,password,phone}) => {
    const user = await User.findByPk(id);
    if (!user) {
        return apiResponse(res, 404, 'User not found');
    }

    if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword;
    }
    
    if (phone) {
        user.phone = phone;
    }

    await user.save();
    return apiResponse(res, 200, 'User updated successfully', user);
}
const deleteUserById = async ({res,id}) => {
    try{
        const user = await User.findByPk(id);
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }
        await user.destroy();
        return apiResponse(res, 204, 'User deleted successfully');
    }catch(err){
        return apiResponse(res, 400, err.message);
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
}