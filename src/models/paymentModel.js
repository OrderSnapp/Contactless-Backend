const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
    },
    paymentDate: {
        type: DataTypes.DATE,
    },
    paymentMethod: {
        type: DataTypes.STRING,
    },
    paymentAmount: {
        type: DataTypes.FLOAT,
    },
    paymentStatus: {
        type: DataTypes.STRING,
    },
    ...timestamp,
});

module.exports = Payment;