const RoleService = require('../services/roleService');

const createRole = async (req, res) => {
    const { name, acronym } = req.body;
    return RoleService.createRoleService({res, name, acronym});
}

const getRoles = async (req, res) => {
    return RoleService.getAllRolesService({res});
}

module.exports = {
    createRole,
    getRoles
};