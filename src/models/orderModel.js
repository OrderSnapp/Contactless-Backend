const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const Table = require('./tableModel');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tableId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Table',
            key: 'id',
        },
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ...timestamp,
});

Table.hasMany(Order, { foreignKey: 'tableId' });
Order.belongsTo(Table, { foreignKey: 'tableId' });

module.exports = Order;