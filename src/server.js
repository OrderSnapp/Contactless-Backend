const http = require('http');
const setupWebSocket = require('./websocket');
const app = require('./app');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
setupWebSocket(server);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});