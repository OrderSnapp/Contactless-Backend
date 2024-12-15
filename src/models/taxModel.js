const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const timestamp = require('../utils/timestamp');

const Tax = sequelize.define('Tax', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    ...timestamp
});

module.exports = Tax;