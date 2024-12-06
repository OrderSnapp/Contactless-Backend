const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
    },
    menuItemDetailId: {
        type: DataTypes.INTEGER,
    },
    Quantity: {
        type: DataTypes.INTEGER,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    ...timestamp,
});

module.exports = OrderDetail;