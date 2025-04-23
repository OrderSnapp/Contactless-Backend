const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const Order = require('./orderModel');

const Payment = sequelize.define('Payment', {
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
        }
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM('CASH', 'CARD', 'ONLINE'),
        allowNull: false,
    },
    paymentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
        defaultValue: 'PENDING',
    },
    receiveAmount:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    changeAmount:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    ...timestamp,
});

Order.hasOne(Payment,{foreignKey: 'orderId'});
Payment.belongsTo(Order,{foreignKey: 'orderId'});

module.exports = Payment;