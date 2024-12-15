const {sequelize} = require('../config/db');
import timestamp from '../utils/timestamp';
import {DataTypes} from 'sequelize';

const Authority = sequelize.define('Authority', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'authority name already in use'
        },
    },
    ...timestamp
});

module.exports = Authority;