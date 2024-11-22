const { Sequelize } = require('sequelize');

// Load environment variables
require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Database user
    process.env.DB_PASSWORD, // Database password
    {
      host: process.env.DB_HOST, // Database host
      dialect: 'mysql', // Database dialect
      logging: false, // Disable logging; you can set it to true for debugging
    }
  );

  // Test the connection
sequelize
.authenticate()
.then(() => {
  console.log('Connection to the database has been established successfully.');
})
.catch((error) => {
  console.error('Unable to connect to the database:', error);
});

module.exports = sequelize;