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
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'menu item detail name already in use'
        },
    },
    imgae:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    status:{
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
        allowNull: false,
    },
    ...timestamp,
});

MenuItem.hasMany(MenuItemDetail);
MenuItemDetail.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

module.exports = MenuItemDetail;