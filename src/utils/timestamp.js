const { DataTypes } = require('sequelize');

const timestamp = {
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },

};

module.exports = timestamp;