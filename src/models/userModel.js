const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const timestamp = require('../utils/timestamp');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Username address already in use'
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hashedPassword);
      }
    },
    phone:{
        type: DataTypes.STRING,
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: 'Active',
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ...timestamp
});

module.exports = User;