const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const MenuItemDetail = require('./menuItemDetailModel');

const Ingredient = sequelize.define('Ingredient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    menuItemDetailId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'MenuItemDetail', 
            key: 'id',
        }
    },
    ...timestamp,
});

MenuItemDetail.hasMany(Ingredient, { foreignKey: 'menuItemDetailId' });
Ingredient.belongsTo(MenuItemDetail, { foreignKey: 'menuItemDetailId' });

module.exports = Ingredient;