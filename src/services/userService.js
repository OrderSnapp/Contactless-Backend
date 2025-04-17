const Role = require('../models/roleModel');
const User = require('../models/userModel');
const UserRole = require('../models/userRoleModel');
const apiResponse = require('../utils/apiResponse');
const { createdBy } = require('../utils/timestamp');

const getAllUsers = async ({ res }) => {
  try {
    // Fetch all users
    const users = await User.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'username',
        'phone',
        'status',
        'updatedAt',
      ],
    });

    if (!users || users.length === 0) {
      return apiResponse(res, 404, 'Users not found');
    }

    // Fetch all user roles
    const userRoles = await UserRole.findAll({
      attributes: ['userId', 'roleId'],
    });

    // Fetch all roles
    const roles = await Role.findAll({
      attributes: ['id', 'name'],
    });

    // Map roles to users
    const usersWithRoles = users.map((user) => {
      const userRole = userRoles.find((ur) => ur.userId === user.id);
      const role = userRole ? roles.find((r) => r.id === userRole.roleId) : null;

      return {
        ...user.dataValues,
        role: role ? role.name : 'No Role',
      };
    });

    return apiResponse(res, 200, 'Users retrieved successfully', usersWithRoles);
  } catch (err) {
    console.log(err);
    return apiResponse(res, 400, err.message);
  }
};

const createUser = async ({res, req}) => {
    try{

        const data = req.body;

        const user = await User.create(
            {   username: data.username, 
                firstName: data.firstName,
                password: data.password, 
                phone : data.phone,
                lastName: data.lastName,
                status: data.status,
                createdBy: req.user.id,
                updatedBy: req.user.id
            }
        );
        
        console.log(user);
        
        const role = await UserRole.create({
            userId: user.id,
            roleId: data.role
        });

        const roleData = await Role.findByPk(role.roleId);

        let newUser = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            status: user.status,
            role: roleData.name,
            updatedAt: user.updatedAt
        };

        return apiResponse(res, 201, 'User created successfully', newUser);
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

const updateUserById = async ({res,req}) => {
    const data = req.body;
    const id = req.params.id;

    try{
        const username = await User.findOne({
            where: {username: data.username},
        });
    
        const user = await User.findByPk(id);
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }
    
        if (username && username.id !== user.id) {
            return apiResponse(res, 400, 'Username already in use');
        }

        if(data.email){
            user.email = data.email;
        }
    
        if (data.password) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(data.password, salt);
            user.password = hashedPassword;
        }
        
        if (data.phone) {
            user.phone = data.phone;
        }
    
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.status = data.status;
        user.username = data.username;
        user.updatedAt = Date.now();
        user.updatedBy = req.user.id;
    
        await user.save();

        if(data.role){
            const userRole = await UserRole.findOne({
                where: {userId: user.id},
            });
            userRole.roleId = data.role;
            await userRole.save();
        }

        return apiResponse(res, 200, 'User updated successfully', user);
    }catch(err){
        return apiResponse(res, 400, err.message);
    }
}

const deleteUserById = async ({res,req}) => {
    try{
        const id = req.params.id;
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