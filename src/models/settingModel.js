const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const Setting = sequelize.define('Setting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shopName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shopLogo: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    Logo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    ...timestamp,
});

module.exports = Setting;