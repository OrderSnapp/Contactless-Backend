const { Sequelize } = require('sequelize');

require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    }
  );

sequelize
.authenticate()
.then(() => {
  console.log('Connection to the database has been established successfully.');
})
.catch((error) => {
  console.error('Unable to connect to the database:', error);
});

module.exports = sequelize;