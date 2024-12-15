const { sequelize } = require('../config/db');
import timestamp from '../utils/timestamp';
import { DataTypes } from 'sequelize';

const Rate = sequelize.define('Rate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    ...timestamp
});

module.exports = Rate;