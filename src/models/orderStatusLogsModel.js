const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const Order = require('./orderModel');

const OrderStatusLogs = sequelize.define('OrderStatusLogs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'ACCEPTED', 'COOKING', 'COOKED', 'COMPLETED'),
        allowNull: false,
    },

    ...timestamp,
}, {
    tableName: 'OrderStatusLogs',
});

module.exports = OrderStatusLogs;