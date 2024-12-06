const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const MenuItemDetail = sequelize.define('MenuItemDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.String,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    ingredientId:{
        type: DataTypes.INTEGER,
    },
    ...timestamp,
});

module.exports = MenuItemDetail;