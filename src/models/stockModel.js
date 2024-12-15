const { sequelize } = require('../config/db');
import timestamp from '../utils/timestamp';
import { DataTypes } from 'sequelize';
import MenuItemDetail from './menuItemDetailModel';

const Stock = sequelize.define('Stock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    MenuItemDetailId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'MenuItemDetail',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ...timestamp
});

MenuItemDetail.hasOne(Stock);
Stock.belongsTo(MenuItemDetail, { foreignKey: 'MenuItemDetailId' });

module.exports = Stock;
