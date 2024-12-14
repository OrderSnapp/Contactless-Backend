const { DataTypes } = require('sequelize');

const timestamp = {
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

};

module.exports = timestamp;