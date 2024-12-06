const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    orderDate: {
        type: DataTypes.DATE,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
    },
    orderStatus: {
        type: DataTypes.FLOAT,
    },
    ...timestamp,
});

module.exports = Order;