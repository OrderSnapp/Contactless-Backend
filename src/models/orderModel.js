const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const Table = require('./tableModel');
const OrderStatusLogs = require('./orderStatusLogsModel');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tableId: {
        type: DataTypes.UUID,
        references: {
            model: 'Table',
            key: 'id',
        },
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    batchNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    subTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discount: {
        type: DataTypes.FLOAT,
    },
    note: {
        type: DataTypes.STRING,
    },
    orderStatus: {
        type: DataTypes.STRING,
    },
    progressStatus: {
        type: DataTypes.ENUM('PENDING','ACCEPTED', 'COOKING', 'COOKED', 'COMPLETED', 'CANCELLED','REJECTED'),
        defaultValue: 'PENDING',
    },
    ...timestamp,
});

Table.hasMany(Order, { foreignKey: 'tableId', as: 'table' });
Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' });
Order.hasMany(OrderStatusLogs, { foreignKey: 'orderId' });

module.exports = Order;