const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const Order = require('./orderModel');
const MenuItemDetail = require('./menuItemDetailModel');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id',
        }
    },
    menuItemDetailId: {
        type: DataTypes.INTEGER,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    price: {
        type: DataTypes.FLOAT,
    },
    total: {
        type: DataTypes.FLOAT,
    },
    ...timestamp,
});

Order.hasMany(OrderDetail,{foreignKey: 'orderId'});
OrderDetail.belongsTo(Order,{foreignKey: 'orderId'});
MenuItemDetail.hasMany(OrderDetail,{foreignKey: 'menuItemDetailId'});
OrderDetail.belongsTo(MenuItemDetail,{foreignKey: 'menuItemDetailId'});


module.exports = OrderDetail;