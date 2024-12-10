const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const Table = sequelize.define('Table', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    menuId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Menu',
            key: 'id',
        },
        allowNull: true,
    },
    qrImage: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
    },
    ...timestamp,
});

module.exports = Table;