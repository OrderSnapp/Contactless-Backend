const Role = require('../models/roleModel');
const apiResponse = require('../utils/apiResponse');

const createRoleService = async ({res, name, acronym}) => {
    try{
        const newRecord = await Role.create({name,acronym});
        return apiResponse(res, 201, 'Role created successfully', newRecord);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const getAllRolesService = async ({res}) => {
    try{
        const roles = await Role.findAll({attributes: ['id', 'name']});
        return apiResponse(res, 200, 'Roles retrieved successfully', roles);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const getRoleService = async ({res, id}) => {
    try{
        const role = await Role.findByPk(id);
        return apiResponse(res, 200, 'Role retrieved successfully', role);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const updateRoleService = async ({res, id, name}) => {
    try{
        const role = await Role.findByPk(id);
        if(!role){
            return apiResponse(res, 404, 'Role not found');
        }
        role.name = name;
        role.updatedAt = new Date();
        await role.save();
        return apiResponse(res, 200, 'Role updated successfully', role);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const deleteRoleService = async ({res, id}) => {
    try{
        const role = await Role.findByPk(id);
        if(!role){
            return apiResponse(res, 404, 'Role not found');
        }
        await role.destroy();
        return apiResponse(res, 200, 'Role deleted successfully');
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    createRoleService,
    getAllRolesService,
    getRoleService,
    updateRoleService,
    deleteRoleService
}