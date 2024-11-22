const app = require('./app');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Sync database models
sequelize.sync({ force: false }).then(() => {
    // `force: false` means data will not be lost
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
});