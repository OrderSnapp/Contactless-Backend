const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const MenuItem = require('./menuItemModel');

const MenuItemDetail = sequelize.define('MenuItemDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    menuItemId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'MenuItem',
            key: 'id',
        },
        field: 'menuItemId'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'menu item detail name already in use'
        },
    },
    imageUrl:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status:{
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
        allowNull: false,
    },
    ingredient:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    ...timestamp,
});

MenuItem.hasMany(MenuItemDetail, { foreignKey: 'menuItemId' , as: 'items' });
MenuItemDetail.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

module.exports = MenuItemDetail;