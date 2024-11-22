const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');

const apiResponse = require('../utils/apiResponse');
const generateAuthToken = require('../utils/generateToken');
const comparePassword = require('../utils/comparePassword');
const Role = require('../models/roleModel');

const registerService = async ({res, username, email, password, phone}) => {
    try{
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return apiResponse(res, 401, 'User already exists');
        }

        const user = await User.create({ username, email, password, phone });
        await UserRole.create({ userId: user.id, roleId: 2 });
        
        return apiResponse(res, 201, 'User created successfully', user);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return apiResponse(res, 400, messages);
        }

        return apiResponse(res, 500, error.message);
    }
};

const loginService = async ({ res, username, password }) => {
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return apiResponse(res, 401, 'Invalid Credentials');
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return apiResponse(res, 401, 'Invalid Credentials');
        }

        // Get user roles
        const userWithRoles = await User.findOne({
            where: { id: user.id },
            include: {
                model: Role,
                attributes: ['name'],
                through: { attributes: [] }
            }
        });

        const roles = userWithRoles.Roles.map(role => role.name);

        const token = generateAuthToken({ id: user.id, username: user.username, roles: roles });
        return apiResponse(res, 200, 'Login successful', { token });
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }}

module.exports = { registerService, loginService };