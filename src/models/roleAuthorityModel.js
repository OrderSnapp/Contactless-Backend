const {sequelize} = require('../config/db');
import {DataTypes} from 'sequelize';
import Role from './roleModel';
import Authority from './authorityModel';

const RoleAuthority = sequelize.define('RoleAuthority', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    authorityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

Role.belongsToMany(Authority, { through: RoleAuthority, foreignKey: 'authorityId' });
Authority.belongsToMany(Role, { through: RoleAuthority, foreignKey: 'roleId' });

module.exports = RoleAuthority;
