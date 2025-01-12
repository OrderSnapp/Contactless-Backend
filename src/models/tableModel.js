const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const sql = require('sequelize');

const Table = sequelize.define('Table', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
        type: DataTypes.STRING,
        allowNull: false,
    },
    ...timestamp,
});

module.exports = Table;