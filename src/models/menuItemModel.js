const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const Menu = require('./menuModel');

const MenuItem = sequelize.define('MenuItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'menu item name already in use'
        },
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    menuId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Menu',
            key: 'id',
        },
    },
    ...timestamp,
});

// Define the association
Menu.hasMany(MenuItem, { foreignKey: 'menuId' , as: 'items' });
MenuItem.belongsTo(Menu, { foreignKey: 'menuId' });

module.exports = MenuItem;