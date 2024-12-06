const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.STRING,
    },
    comment: {
        type: DataTypes.STRING,
    },
    ...timestamp,
});

module.exports = Review;