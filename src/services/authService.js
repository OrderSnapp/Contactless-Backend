const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');
const jwt = require('jsonwebtoken');

const apiResponse = require('../utils/apiResponse');
const generateAuthToken = require('../utils/generateToken');
const comparePassword = require('../utils/comparePassword');
const Role = require('../models/roleModel');

const registerService = async ({res, username, email, password, phone, firstname, lastname}) => {
    try{
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return apiResponse(res, 401, 'User already exists');
        }

        let status = "Active";
        const user = await User.create(
            { 
                username,
                email, 
                password, 
                phone, 
                firstName: firstname,
                lastName: lastname,
                status: status
            }
        );
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

const loginService = async ({ req,res, username, password }) => {
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return apiResponse(res, 401, 'Invalid Credentials');
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return apiResponse(res, 401, 'Invalid Credentials');
        }

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

        return apiResponse(res, 200, 'Login successful', { token , user: username });
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }}

const sessionService = async ({ req, res }) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ id: decoded.id, username: decoded.username, role: decoded.roles[0] });
}

module.exports = { registerService, loginService, sessionService };